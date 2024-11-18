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
 * 회원탈퇴 클릭 시 모달 창 띄움
 */
const userDeleteText = function(){
    const userDeleteText = document.getElementById('user-delete');
    const userModal = document.getElementById('user-modal');

    userDeleteText.addEventListener('click', () => {
        openModal(userModal);
    });
}
//회원탈퇴 모달창 취소, 확인
const userModal = function() {
    const userCancelBtn = document.getElementById('user-cancel-btn');
    const userCheckBtn = document.getElementById('user-check-btn');
    //취소
    userCancelBtn.addEventListener('click', () => {
        closeModal();
    });
    //확인
    userCheckBtn.addEventListener('click', () => {
        
    });
}

const modalContainer = document.querySelector('.modal-container');
const body = document.body;

dropdown();
userDeleteText();
userModal();