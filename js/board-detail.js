document.addEventListener('DOMContentLoaded', () => {
    loadBoardData();
    postDelete();
    postModal();
    commentModify();
    commentDelete();
    commentModal();
});

const modalContainer = document.getElementById('modal-container');
const body = document.body;

// 공통으로 사용할 스타일 설정 함수
const openModal = function(modal) {
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

const closeModal = function() {
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
const postModify = function(){
    const postDeleteBtn = document.getElementById('delete-btn');

    postDeleteBtn.addEventListener('click', () => {
        //수정창 이동 로직 넣기(글 id를 가진 채)
    });
};

/**
 * 우측 상단 삭제 버튼 누르면 삭제 모달창 띄우기
 * 모달 띄워질 때 조건
 * 1. 백그라운드 불투명도 50% 블랙
 * 2. 백그라운드 스크롤, 클릭 안됨
 */
const postDelete = function(){
    const postDeleteBtn = document.getElementById('delete-btn');
    const postDeleteModal = document.getElementById('board-modal');

    postDeleteBtn.addEventListener('click', () => {
       openModal(postDeleteModal);
    });
};

//글 삭제 모달창 취소, 확인
const postModal = function() {
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
 * 댓글 수정 버튼 누르면 기존 댓글 입력창에 기존 텍스트 내용이 보여짐
 * 댓글 등록 버튼이 댓글 수정으로 변경
 */
const commentModify = function(){
    const commentModifyBtn = document.getElementById('modify-reply-btn');
    const commentTextarea = document.getElementById('reply-textarea');
    const commentBtn = document.getElementById('reply-btn');

    commentModifyBtn.addEventListener('click', () => {
        console.log('click!!');
        //기존 댓글 내용을 댓글 창에 띄워주기
        commentTextarea.value = '기존 내용 넣기';

        //댓글 등록 버튼 댓글 수정으로 변경
        commentBtn.textContent = '댓글 수정';
    });
};

/**
 * 댓글 삭제 버튼 누르면 삭제 모달창 띄우기
 * 모달 띄워질 때 조건
 * 1. 백그라운드 불투명도 50% 블랙
 * 2. 백그라운드 스크롤, 클릭 안됨
 */
const commentDelete = function(){
    const commentDeleteBtn = document.getElementById('delete-reply-btn');
    const commentDeleteModal = document.getElementById('reply-modal');

    commentDeleteBtn.addEventListener('click', () => {
        openModal(commentDeleteModal);
    });
};

//댓글 삭제 모달창 취소, 확인
const commentModal = function(){
    const commentCancelBtn = document.getElementById('reply-cancel-btn');
    const commentCheckBtn = document.getElementById('reply-check-btn');
    //취소
    commentCancelBtn.addEventListener('click', () => {
        closeModal();
    });
    //확인
    commentCheckBtn.addEventListener('click', () => {
        
    });
}

//게시글 데이터를 가져오는 함수
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
        
        displayPostAndUser(post.data);
        
    } catch (error) {
        console.error('잘못된 요청입니다.', error);
    }
};

const displayPostAndUser = function(post){
    //게시글 정보 표시
    document.getElementById('title').textContent = post.title; // 제목
    document.getElementById('board-content').textContent = post.content; // 내용    
    document.getElementById('like-count').textContent = numToK(post.like_count); // 좋아요수
    document.getElementById('view-count').textContent = numToK(post.view_count); // 조회수
    document.getElementById('reply-count').textContent = numToK(post.comment_count); // 댓글수
    
    if(post.post_image !== ''){
        document.getElementById('board-image').src = post.post_image;
    }else{
        document.getElementById('board-image').style.display = 'none';
    }
    

    //작성자 정보 표시
    document.getElementById('username').textContent = post.post_author.nickname; // 작성자 이름
    document.getElementById('created-at').textContent = post.post_modified_at; // 작성일
    document.querySelector('.profile-image').src = post.post_author.profile_image; // 프로필 이미지
}

/**
 * 좋아요수, 댓글수, 조회수
 * 1000이상 1k
 * 10000이상 10k
 * 100000이상 100k
 */
const numToK = function(num){
    if(num >= 100000){
        return Math.floor(num/1000) + 'k';
    }else if(num >= 10000){
        return Math.floor(num/1000) + 'k';
    }else if(num >= 1000){
        return Math.floor(num/1000) + 'k';
    }else{
        return num;
    }
}



