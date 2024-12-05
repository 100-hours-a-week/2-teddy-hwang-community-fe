document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 동적으로 header HTML 생성
        const headerHtml = generateHeaderHtml();
        document.getElementById('header-container').innerHTML = headerHtml;

        // header 초기화 진행
        await initializeHeader();
    } catch (error) {
        console.error('Failed to load header:', error);
    }
});

const generateHeaderHtml = () => {
    const path = window.location.pathname;

    const headerConfig = {
        //모두 없는 페이지
        '/': {showBackIcon: false, showAccount: false},

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
    return `
        <header>
            <div class="back-icon-container">
                ${config.showBackIcon ? '<span class="material-icons">arrow_back_ios</span>' : ''}
            </div>
            <h1>아무 말 대잔치</h1>
            <div class="account-container">
                ${config.showAccount ? `
                    <span class="account-box">
                        <img class="account-image" src="/images/profile-image.jpg" alt="profile" />
                        <div id="dropdown-container"></div>
                    </span>
                ` : ''}
            </div>
        </header>
    `;
};

const initializeHeader = async () => {
    try {
        const hasAccountImage = document.querySelector(".account-image");
        
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

const initializeBackButton = () => {
    const headerContainer = document.getElementById('header-container');
    headerContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('material-icons')) {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/';
            }
        }
    });
};

const initializeDropdown = () => {
    const profileImage = document.querySelector(".account-image");
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
        logoutLink.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
};