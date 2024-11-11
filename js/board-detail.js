/**
 * 우측 상단 수정 버튼 누르면 수정창으로 이동
 */
const postModify = function(){
    const postDeleteBtn = document.getElementById('delete-btn');
    const postDeleteModal = document.getElementById('board-modal');

    postDeleteBtn.addEventListener('click', () => {
        console.log('click!');
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
        postDeleteModal.style.display = 'block';    
        //백그라운드 투명도 변경
        modalContainer.style.display = 'flex';
        //백그라운드 스크롤, 클릭X
        body.style.overflow = 'hidden';

    });
};

//삭제 모달창 취소, 확인
const postModal = function() {
    const postCancelBtn = document.getElementById('board-cancel-btn');
    const postCheckBtn = document.getElementById('board-check-btn');
    //취소
    postCancelBtn.addEventListener('click', () => {
        modalContainer.style.display = 'none';
        body.style.overflow = 'visible';
        console.log('cancel click!!')
    });
    //확인
    postCheckBtn.addEventListener('click', () => {
        
    });
}

const modalContainer = document.querySelector('.modal-container');
const body = document.body;

postDelete();
postModal();