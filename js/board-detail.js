document.addEventListener('DOMContentLoaded', async () => {
    await loadBoardData();
    await handleComment();
    postDelete();   
    postModal();
    commentDelete();
    commentModal();
    postModify();
    handleLike();
});

const modalContainer = document.querySelector('.modal-container');
const body = document.body;
let deleteCommentId = null;
//경로 파라미터 추출
const pathname = window.location.pathname;
const postId = Number(pathname.split('/')[2]); 
const userId = authManager.getUserInfo()?.id;

// 공통으로 사용할 스타일 설정 함수
const openModal = (modal) => {
    const activeModal = document.querySelector('.modal.active');
    //기존에 열려있는 모달 닫기
    if (activeModal) {
        closeModal();
    }

    modal.style.display = 'block'; // 모달 보이기
    modal.classList.add('active'); // 활성화 클래스 추가
    modalContainer.style.display = 'flex'; // 배경 어두운 투명도 적용
    body.style.overflow = 'hidden'; // 스크롤 막기
};

const closeModal = () => {
    const activeModal = document.querySelector('.modal.active');
    //모달 닫기
    if (activeModal) {
        activeModal.style.display = 'none'; // 모달 숨기기
        activeModal.classList.remove('active'); // 활성화 클래스 제거
    }

    modalContainer.style.display = 'none'; // 배경 숨기기
    body.style.overflow = 'visible'; // 스크롤 복원
};

/**
 * 우측 상단 수정 버튼 누르면 수정창으로 이동
 */
const postModify = () => {
    const postModifyBtn = document.getElementById('modify-btn');
    postModifyBtn.addEventListener('click', () => {
        //수정창 이동 로직 넣기(글 id를 가진 채)
        location.href = `/posts/${postId}/edit`;
    });
};

/**
 * 우측 상단 삭제 버튼 누르면 삭제 모달창 띄우기
 * 모달 띄워질 때 조건
 * 1. 백그라운드 불투명도 50% 블랙
 * 2. 백그라운드 스크롤, 클릭 안됨
 */
const postDelete = () => {
    const postDeleteBtn = document.getElementById('delete-btn');
    const postDeleteModal = document.getElementById('board-modal');

    postDeleteBtn.addEventListener('click', () => {
        openModal(postDeleteModal);
    });
};

//글 삭제 모달창 취소, 확인
const postModal = async () => {
    const postCancelBtn = document.getElementById('board-cancel-btn');
    const postCheckBtn = document.getElementById('board-check-btn');
    //취소
    postCancelBtn.addEventListener('click', () => {
        closeModal();
    });
    //확인
    postCheckBtn.addEventListener('click', async () => {
        try {
            const response = await apiDelete(`${address}/api/posts/${postId}`);
            
            if(!response.response.ok){
                throw new Error('글 삭제에 실패했습니다.');
            }
            closeModal();
            // 현재 페이지를 글 목록 페이지로 대체
            history.replaceState({ postDeleted: true }, '', '/posts');
            location.href = `/posts`;
        } catch (error) {
            throw new Error('글 삭제에 실패했습니다.', error);           
        }        
    });
}

/**
 * 댓글 삭제 버튼 누르면 삭제 모달창 띄우기
 * 모달 띄워질 때 조건
 * 1. 백그라운드 불투명도 50% 블랙
 * 2. 백그라운드 스크롤, 클릭 안됨
 */
const commentDelete = () => {
    const commentDeleteModal = document.getElementById('reply-modal');

    const commentList = document.querySelector('.reply-list');
    //삭제 버튼 클릭 이벤트를 댓글 목록 컨테이너에 위임
    commentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-reply-btn')) {
            deleteCommentId = e.target.getAttribute('comment-id');
            openModal(commentDeleteModal);
        }
    });
};

//댓글 삭제 모달창 취소, 확인
const commentModal = async () => {
    const commentCancelBtn = document.getElementById('reply-cancel-btn');
    const commentCheckBtn = document.getElementById('reply-check-btn');
    //취소
    commentCancelBtn.addEventListener('click', () => {
        closeModal();
        deleteCommentId = null;
    });
    //확인
    commentCheckBtn.addEventListener('click', async () => {
        if(!deleteCommentId) return;
        try {
            const response = await apiDelete(`${address}/api/comments/${deleteCommentId}`);
            
            if(!response.response.ok){
                throw new Error('댓글 삭제에 실패했습니다.');
            }
            closeModal();
            deleteCommentId = null;
            await loadBoardData(); 
        } catch (error) {
            throw new Error('댓글 삭제에 실패했습니다.', error);           
        }        
    });
}
//게시판을 렌더링하는 함수
const loadBoardData = async () => {
    try {        
        const post = await apiGet(`${address}/api/posts/${postId}`);

        displayPost(post.data.data);

    } catch (error) {
        console.error('잘못된 요청입니다.', error);
    }
};

const displayPost = (post) => {
    //게시글 정보 표시
    document.getElementById('title').textContent = post.title; // 제목
    document.getElementById('board-content').textContent = post.content; // 내용    
    document.getElementById('like-count').textContent = numToK(post.like_count); // 좋아요수
    document.getElementById('view-count').textContent = numToK(post.view_count); // 조회수
    document.getElementById('reply-count').textContent = numToK(post.comment_count); // 댓글수

    if (post.post_image !== '') {
        document.getElementById('board-image').src = post.post_image;
    } else {
        document.getElementById('board-image').style.display = 'none';
    }

    // 게시글 작성자인 경우 수정/삭제 버튼 표시
    if (userId === post.user_id) {
        document.getElementById('modify-btn').style.display = 'block';
        document.getElementById('delete-btn').style.display = 'block';
    }else {
        document.getElementById('modify-btn').style.display = 'none';
        document.getElementById('delete-btn').style.display = 'none';
    }

    //작성자 정보 표시
    document.getElementById('username').textContent = post.post_author.nickname; // 작성자 이름
    document.getElementById('created-at').textContent = post.post_modified_at; // 작성일
    document.querySelector('.profile-image').src = post.post_author.profile_image; // 프로필 이미지

    // 댓글 표시
    const replyListContainer = document.querySelector('.reply-list');
    replyListContainer.innerHTML = ''; // 기존 내용 초기화

    post.comments.forEach(comment => {
        // 댓글 컨테이너 생성
        const replyItem = document.createElement('div');
        replyItem.className = 'reply-item';

        // 댓글 기본 구조 생성
        replyItem.innerHTML = `
            <article class="reply-info">
                <article class="reply-info-wrap">
                    <span class="reply-box">
                        <img class="reply-profile-image" src="${comment.author.profile_image}" />
                    </span>
                    <span class="reply-created-at">${comment.modified_at}</span>
                </article>
                <article class="reply-content-container">
                    <p class="reply-content"></p>
                </article>
            </article>
        `;

        // username을 textContent로 추가
        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'reply-username';
        usernameSpan.textContent = comment.author.nickname;
        replyItem.querySelector('.reply-info-wrap').insertBefore(
            usernameSpan,
            replyItem.querySelector('.reply-created-at')
        );

        // 댓글 내용을 textContent로 추가
        replyItem.querySelector('.reply-content').textContent = comment.content;

        // 작성자인 경우 수정/삭제 버튼 추가
        if (comment.author.user_id === userId) {
            const btnContainer = document.createElement('article');
            btnContainer.className = 'reply-btn-container';
            btnContainer.innerHTML = `
                <button type="button" class="modify-reply-btn" comment-id="${comment.comment_id}">수정</button>
                <button type="button" class="delete-reply-btn" comment-id="${comment.comment_id}">삭제</button>
            `;
            replyItem.appendChild(btnContainer);
        }

        replyListContainer.appendChild(replyItem);
    });
}

// 댓글 작성 및 수정 통합
const handleComment = async () => {
    const commentList = document.querySelector('.reply-list');
    const commentInput = document.getElementById('reply-textarea');
    const commentBtn = document.getElementById('reply-btn');
    let commentId = null;

    //버튼 스타일 변경 함수
    const updateButtonStyle = (value) => {
        if (value.trim()) {
            commentBtn.classList.add('active');
            commentBtn.disabled = false;
        } else {
            commentBtn.classList.remove('active');
            commentBtn.disabled = true;
        }
    };
    
    //댓글 입력 시 버튼 스타일 변경
    commentInput.addEventListener('input', () => {
        updateButtonStyle(commentInput.value);
    });

    //수정 버튼 클릭 이벤트를 댓글 목록 컨테이너에 위임
    commentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('modify-reply-btn')) {
            const editCommentId = e.target.getAttribute('comment-id');
            const replyContent = e.target.closest('.reply-item').querySelector('.reply-content').textContent;

            commentInput.value = replyContent;
            commentId = editCommentId;
            commentBtn.textContent = '댓글 수정';
            updateButtonStyle(replyContent);

            // 댓글 입력하는 창으로 스크롤
            commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    //댓글 작성/수정 이벤트
    commentBtn.addEventListener('click', async () => {
        const content = commentInput.value;

        if(!content) {
            return;
        }

        try {
            let response; 
            const commentData = {
                user_id: userId,
                post_id: postId,
                content: content
            }

            //수정 모드와 작성 구분
            if(commentId) {
                //수정
                commentData.comment_id = commentId; // 수정 시에만 댓글 ID 추가
                response = await apiPatch(`${address}/api/comments/${commentId}`, JSON.stringify(commentData));            
            } else {
                //작성
                response = await apiPost(`${address}/api/comments`, JSON.stringify(commentData));   
            }

            if(!response.response.ok) {
                throw new Error(commentId ? '댓글 수정에 실패했습니다.' : '댓글 작성에 실패했습니다.');
            }
            await loadBoardData(); 

            // 입력창 초기화
            commentInput.value = '';
            commentId = null;
            commentBtn.textContent = '댓글 등록';
            updateButtonStyle('');
            
            // 작성 후 최하단으로 스크롤 이동
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error);
        }
    });
}
//좋아요 기능 구현
const handleLike = async () => {
    const likeBtn = document.querySelector('.like'); 
    const likeCount = document.getElementById('like-count');
    let isLiked = false; 

    //초기 좋아요 상태 로드
    const loadLikeStatus = async () => {
        // 로그인 상태 체크
        if (!userId) {
            isLiked = false;
            updateLikeUI();
            return;
        }
        try {
            const response = await apiGet(`${address}/api/posts/${postId}/like?userId=${userId}`);
            isLiked = response.data.is_liked;
            //UI 업데이트
            updateLikeUI();
        } catch (error) {
            console.error('좋아요 상태 조회 중 오류가 발생했습니다', error);
        }
    };
    //UI 업데이트 함수
    const updateLikeUI = () => {
        const likeSpacing = "6px";

        likeBtn.animate(
           isLiked 
               ? [{transform: 'scale(1)', marginRight: '0'}, {transform: 'scale(1.2)', marginRight: likeSpacing}]
               : [{transform: 'scale(1.2)', marginRight: likeSpacing}, {transform: 'scale(1)', marginRight: '0'}],
           {
               duration: 200,
               easing: 'ease',
               fill: 'forwards'
           }
        );
        
        likeCount.animate(
           isLiked 
               ? [{transform: 'scale(1)'}, {transform: 'scale(1.1)'}]
               : [{transform: 'scale(1.1)'}, {transform: 'scale(1)'}],
           {
               duration: 200,
               easing: 'ease',
               fill: 'forwards'
           }
        );
    };

   // 좋아요 토글 함수
   const toggleLike = async () => {
        try {
            let apiResponse;
            if (!isLiked) {
                // 좋아요 추가
                apiResponse = await apiPost(`${address}/api/posts/${postId}/like`, JSON.stringify({ user_id: userId }));
                
                if(apiResponse.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/';
                    return;  
                }
            } else {
                // 좋아요 취소
                apiResponse = await apiDelete(`${address}/api/posts/${postId}/like?userId=${userId}`);

                if(apiResponse.status === 401) {
                    alert('로그인이 필요한 서비스입니다.');
                    location.href = '/';
                    return;  
                }
            }
            likeCount.textContent = numToK(apiResponse.data.data.like_count);
            isLiked = !isLiked; // 상태 토글
            updateLikeUI(); // UI 업데이트

        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다', error);
        }
    };

    likeBtn.addEventListener('click', toggleLike);
    
    //초기 상태 로드
    loadLikeStatus();
};
/**
 * 좋아요수, 댓글수, 조회수
 * 1000이상 1k
 * 10000이상 10k
 * 100000이상 100k
 */
const numToK = (num) => {
    if (num >= 100000) {
        return Math.floor(num / 1000) + 'k';
    } else if (num >= 10000) {
        return Math.floor(num / 1000) + 'k';
    } else if (num >= 1000) {
        return Math.floor(num / 1000) + 'k';
    } else {
        return num;
    }
}
/**
 * 댓글은 200자까지 작성 가능
 * 200자 이상 작성시 작성 안됨
 */
const replyMaxLength = (input, maxLength) => {
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
};