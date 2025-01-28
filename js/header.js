document.addEventListener('DOMContentLoaded', async () => {   
    try {     
        const path = window.location.pathname;

        // 인증이 필요하지 않은 페이지 목록
        const publicPaths = [
            '/',  // 로그인 페이지
            '/signup',  // 회원가입
            '/posts'  // 글 전체조회
        ];
        
        // 글 상세조회 페이지 체크
        const isPostDetailPage = path.match(/^\/posts\/\d+$/); 
         
        // 현재 페이지가 인증이 필요한지 체크
        const requiresAuth = !publicPaths.includes(path) && !isPostDetailPage;
        
        if (requiresAuth) {
            // 인증 체크를 위한 API 요청
            const headers = await authManager.getAuthHeader();
            const userId = authManager.getUserInfo()?.id;

            const response = await fetch(`${address}/api/users/${userId}`, {
                headers,
                credentials: 'include'
            });

            if (response.status === 401) {
                alert('로그인이 필요한 서비스입니다.');
                location.href = '/';
                return;
            }
        }

        // 동적으로 header HTML 생성
        const headerHtml = await generateHeaderHtml();
        
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            throw new Error('header-container element not found');
        }
        
        headerContainer.innerHTML = headerHtml;
        await initializeHeader();
    } catch (error) {
        console.error('Failed to load header:', error);
    }
});

//html을 뿌려줄 건데 동적인 요소가 들어감
const generateHeaderHtml = async () => {
    const path = window.location.pathname;
    try {
        const headerConfig = {
            //모두 없는 페이지
            '/': { showBackIcon: false, showAccount: false },

            //프로필 이미지만 있는 페이지
            '/posts': { showBackIcon: false, showAccount: true },
            '/users/profile': { showBackIcon: false, showAccount: true },
            '/users/password': { showBackIcon: false, showAccount: true },

            //둘 다 있는 페이지
            '/posts/create': { showBackIcon: true, showAccount: true },

            //뒤로가기만 있는 페이지
            '/signup': { showBackIcon: true, showAccount: false }
        }   

        //게시글 상세조회, 수정은 동적 경로 처리 필요
        if (path.match(/^\/posts\/\d+$/)) {
            headerConfig[path] = { showBackIcon: true, showAccount: true };
        }
        if (path.match(/^\/posts\/\d+\/edit$/)) {
            headerConfig[path] = { showBackIcon: true, showAccount: true };
        }

        const config = headerConfig[path];

        // 계정 컨테이너 HTML 생성
        const accountHtml = config.showAccount 
        ? `<span class="account-box">
                <img class="account-image" src="${authManager.getUserInfo()?.profile_image || basicProfileImage}" alt="profile" />
                <div id="dropdown-container"></div>
            </span>`
        : '';
        return `
            <header>
                <div class="back-icon-container">
                    ${config.showBackIcon ? '<span class="material-icons">arrow_back_ios</span>' : ''}
                </div>
                <h1 class="site-title" style="cursor: pointer">🧸Teddy's House</h1>
                <div class="account-container">
                    ${accountHtml}
                </div>
            </header>
        `;
    } catch (error) {
        throw new Error('html를 동적으로 불러오지 못했습니다.', error);
    }
    
};

const initializeHeader = async () => {
    try {
        const hasAccountImage = document.querySelector(".account-image");

        // 제목 클릭 이벤트 추가
        const siteTitle = document.querySelector(".site-title");
        if (siteTitle) {
            siteTitle.addEventListener("click", () => {
                location.href = '/posts';
            });
        }
        // 계정 이미지가 있을 때만 드롭다운 로드
        if (hasAccountImage) {
            const dropdownResponse = await fetch('/html/dropdown.html');
            const dropdownHtml = await dropdownResponse.text();
            document.getElementById('dropdown-container').innerHTML = dropdownHtml;
        }

        // 각 기능 초기화
        initializeBackButton();
        initializeDropdown();
        initializeLinks();
    } catch (error) {
        console.error('Header initialization failed:', error);
    }
};
//뒤로가기 버튼 초기화
const initializeBackButton = () => {
    const headerContainer = document.getElementById('header-container');

    // 뒤로가기 감지 이벤트 리스너
    if (document.addEventListener) {
        window.addEventListener('pageshow', function(event) {
            if (event.persisted || window.performance && window.performance.navigation.type == 2) {
                location.reload();
            }
        }, false);
    }
    headerContainer.addEventListener('click', (e) => {    
        if (e.target.classList.contains('material-icons')) {
            if (window.history.length > 1) {  
                history.back();  
            } else {
                window.location.href = '/';
            }
        }
    });
};
//드롭다운 초기화
const initializeDropdown = () => {
    const profileImage = document.querySelector(".account-box");
    const dropdown = document.getElementById("dropdown");

    if (!profileImage || !dropdown) return;

    profileImage.addEventListener("click", () => {
        dropdown.style.display = "block";
        dropdown.classList.toggle("show");
    });

    dropdown.addEventListener("mouseleave", () => {
        dropdown.style.display = "none";
        dropdown.classList.remove("show");
    });
};

const initializeLinks = () => {
    const userModifyLink = document.getElementById('user-modify-link');
    const passwordModifyLink = document.getElementById('password-modify-link');
    const logoutLink = document.getElementById('logout-link');

    if (userModifyLink) {
        userModifyLink.addEventListener('click', () => {
            window.location.href = `/users/profile`;
        });
    }

    if (passwordModifyLink) {
        passwordModifyLink.addEventListener('click', () => {
            window.location.href = `/users/password`;
        });
    }

    if (logoutLink) {
        const token = authManager.getAccessToken();
        logoutLink.addEventListener('click', async () => {
            try {
                const response = await fetch(`${address}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'  // Refresh Token 쿠키를 위해 필요
                });
    
                if(!response.ok) {
                    throw new Error('로그아웃에 실패했습니다.');
                }
    
                // 클라이언트 측 토큰 제거
                authManager.removeAccessToken();
            
                window.location.href = '/';
            } catch (error) {
                console.error('로그아웃에 실패했습니다.', error);
                
                authManager.removeAccessToken();
                window.location.href = '/';
            }
        });
    }
};