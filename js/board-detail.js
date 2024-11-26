document.addEventListener('DOMContentLoaded', () => {
    loadBoardData();
    postDelete();
    postModal();
    commentDelete();
    commentModal();
    handleComment();
    postModify();
});

const modalContainer = document.querySelector('.modal-container');
const body = document.body;
let deleteCommentId = null;

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
    //현재 주소 및 쿼리 파라미터 추출
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const postId = urlParams.get('postId');
    console.log(postId);
    
    const postModifyBtn = document.getElementById('modify-btn');
    postModifyBtn.addEventListener('click', () => {
        //수정창 이동 로직 넣기(글 id를 가진 채)
        location.href = `../html/board-modify.html?postId=${postId}`;
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
const postModal = () => {
    const postCancelBtn = document.getElementById('board-cancel-btn');
    const postCheckBtn = document.getElementById('board-check-btn');
    //취소
    postCancelBtn.addEventListener('click', () => {
        closeModal();
    });
    //확인
    postCheckBtn.addEventListener('click', () => {
        
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
const commentModal = function () {
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
            const response = await fetch(`http://localhost:8080/api/comments/${deleteCommentId}`, {
                method: 'DELETE'
            });
            
            if(!response.ok){
                throw new Error('댓글 삭제에 실패했습니다.');
            }
            closeModal();
            deleteCommentId = null;
            location.reload();
        } catch (error) {
            throw new Error('댓글 삭제에 실패했습니다.', error);           
        }        
    });
}

//데이터를 가져오는 함수
const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`네트워크 에러: ${url}`);
    return await response.json();
};

//게시판을 렌더링하는 함수
const loadBoardData = async () => {
    try {
        //querystring 추출
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('postId');

        const post = await fetchData(`http://localhost:8080/api/posts/${postId}`);

        displayPost(post.data);

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

    //작성자 정보 표시
    document.getElementById('username').textContent = post.post_author.nickname; // 작성자 이름
    document.getElementById('created-at').textContent = post.post_modified_at; // 작성일
    document.querySelector('.profile-image').src = post.post_author.profile_image; // 프로필 이미지

    // 댓글 표시
    const replyListContainer = document.querySelector('.reply-list');
    replyListContainer.innerHTML = ''; // 기존 내용 초기화

    post.comments.forEach(comment => {
        const currentUserId = 1; // 로그인한 사용자 ID 가져오기

        const replyHTML = `
            <div class="reply-item">
                <article class="reply-info">
                    <article class="reply-info-wrap">
                        <span class="reply-box">
                            <img class="reply-profile-image" src="${comment.author.profile_image}" />
                        </span>
                        <span class="reply-username">${comment.author.nickname}</span>
                        <span class="reply-created-at">${comment.modified_at}</span>
                    </article>
                    <article class="reply-content-container">
                        <p class="reply-content">${comment.content}</p>
                    </article>
                </article>
                ${comment.user_id === parseInt(currentUserId) ? `
                    <article class="reply-btn-container">
                        <button type="button" class="modify-reply-btn" comment-id=${comment.id}>수정</button>
                        <button type="button" class="delete-reply-btn" comment-id=${comment.id}>삭제</button>
                    </article>
                ` : ''}
            </div>
        `;
        replyListContainer.insertAdjacentHTML('beforeend', replyHTML);
    });
}

// 댓글 작성 및 수정 통합
const handleComment = () => {
    const commentList = document.querySelector('.reply-list');
    const commentInput = document.getElementById('reply-textarea');
    const commentBtn = document.getElementById('reply-btn');
    let commentId = null;

    //버튼 스타일 변경 함수
    const updateButtonStyle = (value) => {
        if (value.trim()) {
            commentBtn.style.backgroundColor = '#7F6AEE';
            commentBtn.disabled = false;
        } else {
            commentBtn.style.backgroundColor = '#ACA0EB';
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
                user_id: 1,
                post_id: 1,
                content: content
            }

            //수정 모드와 작성 구분
            if(commentId) {
                // 수정 
                response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(commentData)
                });
                
            } else {
                //작성
                response = await fetch(`http://localhost:8080/api/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(commentData)
                });
            }

            if(!response.ok) {
                throw new Error(commentId ? '댓글 수정에 실패했습니다.' : '댓글 작성에 실패했습니다.');
            }

            // 입력창 초기화
            commentInput.value = '';
            commentId = null;
            commentBtn.textContent = '댓글 등록';
            updateButtonStyle('');

            location.reload();

        } catch (error) {
            console.error('Error:', error);
        }
    });
}
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



