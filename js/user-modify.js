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
        //탈퇴 처리

        //로그인으로 이동
        location.href = '../html/login.html';
    });
}

/**
 * 수정하기 버튼 클릭했을 때
 * 닉네임 입력X -> *닉네임을 입력해주세요.
 * 닉네임 중복시 -> *중복된 닉네임 입니다.
 * 닉네임 11자 이상 작성시 -> *닉네임은 최대 10자 까지 작성 가능합니다.
 */
const nicknameInput = function(){
    const nicknameInput = document.getElementById('nickname');
    const modifyBtn = document.getElementById('modify-btn');
    const helpertext = document.getElementById('helpertext');

    const showNicknameError = function(nickname){

        //닉네임을 입력하지 않은 경우
        if(nickname === ''){
            helpertext.textContent = '*닉네임을 입력해주세요.';
            nicknameValid = false;
            return;
        }
        if(!nicknameIsValid(nickname)){       
            //닉네임에 띄어쓰기가 포함된 경우
            if(nickname.includes(' ')){
                helpertext.textContent = '*띄어쓰기를 없애주세요.';
                nicknameValid = false;
                return;
            }
            //닉네임 길이가 10글자 초과하는 경우
            if(nickname.length > 10){
                helpertext.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
                nicknameValid = false;
                return;
            }
            //닉네임 중복시 추가 작성해야함
        }
        helpertext.textContent = '';
        nicknameValid = true;
        return;
    }

    modifyBtn.addEventListener('click', () => {
        showNicknameError(nicknameInput.value);
        if(nicknameValid) toastMessage();
    });

};

const nicknameIsValid = (nickname) => {
    //띄어쓰기 없이 최대 10글자
    const nicknamePattern = /^[^\s]{1,10}$/; 
    return nicknamePattern.test(nickname);
};
//토스트 메시지 1초 보여주기
const toastMessage = function(){
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
}

let nicknameValid;
const modalContainer = document.getElementById('modal-container');
const body = document.body;


userDeleteText();
userModal();
nicknameInput();