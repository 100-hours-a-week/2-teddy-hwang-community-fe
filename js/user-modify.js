document.addEventListener('DOMContentLoaded', () => {
  userDeleteText();
  userModal();
  nicknameInput();
  loadUser();
  changeImage();
});

let nicknameValid = false;
const modalContainer = document.querySelector(".modal-container");
const body = document.body;

//현재 주소 및 쿼리 파라미터 추출
const pathname = window.location.pathname;
const userId = Number(pathname.split('/')[2]); 


let selectedImageFile = '';

// 공통으로 사용할 스타일 설정 함수
const openModal = (modal) => {
  const activeModal = document.querySelector(".modal.active");
  //기존에 열려있는 모달 닫기
  if (activeModal) {
    closeModal();
  }

  modal.style.display = "block"; // 모달 보이기
  modal.classList.add("active"); // 활성화 클래스 추가
  modalContainer.style.display = "flex"; // 배경 어두운 투명도 적용
  body.style.overflow = "hidden"; // 스크롤 막기
};

const closeModal = () => {
  const activeModal = document.querySelector(".modal.active");
  //모달 닫기
  if (activeModal) {
    activeModal.style.display = "none"; // 모달 숨기기
    activeModal.classList.remove("active"); // 활성화 클래스 제거
  }

  modalContainer.style.display = "none"; // 배경 숨기기
  body.style.overflow = "visible"; // 스크롤 복원
};
/**
 * 회원탈퇴 클릭 시 모달 창 띄움
 */
const userDeleteText = () => {
  const userDeleteText = document.getElementById("user-delete");
  const userModal = document.getElementById("user-modal");

  userDeleteText.addEventListener("click", () => {
    openModal(userModal);
  });
};
//회원탈퇴 모달창 취소, 확인
const userModal = () => {
  const userCancelBtn = document.getElementById("user-cancel-btn");
  const userCheckBtn = document.getElementById("user-check-btn");
  //취소
  userCancelBtn.addEventListener("click", () => {
    closeModal();
  });
  //확인
  userCheckBtn.addEventListener("click", () => {
    //탈퇴 처리

    //로그인으로 이동
    location.href = "/";
  });
};

/**
 * 수정하기 버튼 클릭했을 때
 * 닉네임 입력X -> *닉네임을 입력해주세요.
 * 닉네임 중복시 -> *중복된 닉네임 입니다.
 * 닉네임 11자 이상 작성시 -> *닉네임은 최대 10자 까지 작성 가능합니다.
 */
const nicknameInput = () => {
  const nicknameInput = document.getElementById("nickname");
  const modifyBtn = document.getElementById("modify-btn");
  const helpertext = document.getElementById("helpertext");

  const showNicknameError = async (nickname) => {
    //닉네임을 입력하지 않은 경우
    if (nickname === "") {
      helpertext.textContent = "*닉네임을 입력해주세요.";
      nicknameValid = false;
      return;
    }
    if (!nicknameIsValid(nickname)) {
      //닉네임에 띄어쓰기가 포함된 경우
      if (nickname.includes(" ")) {
        helpertext.textContent = "*띄어쓰기를 없애주세요.";
        nicknameValid = false;
        return;
      }
      //닉네임 길이가 10글자 초과하는 경우
      if (nickname.length > 10) {
        helpertext.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다.";
        nicknameValid = false;
        return;
      }
    }
     //닉네임 중복시 추가 작성해야함
    try {
      const response = await fetch(`http://localhost:8080/api/users/nickname/${nickname}`, {
        credentials: 'include'
      });
      result = await response.json();
      if(!result.data) {
        helpertext.textContent = "*중복된 닉네임 입니다.";
        nicknameValid = false;
        return;
      }else {
        helpertext.textContent = "";
        nicknameValid = true;
        toastMessage();
        return;
      }
    } catch (error) {
      throw new Error('닉네임 중복 확인에 실패했습니다', error);
    }
  };

  modifyBtn.addEventListener("click", async () => {
    await showNicknameError(nicknameInput.value);
    if (nicknameValid) {
      updateUser(nicknameInput);
    }
  });
};

const nicknameIsValid = (nickname) => {
  //띄어쓰기 없이 최대 10글자
  const nicknamePattern = /^[^\s]{1,10}$/;
  return nicknamePattern.test(nickname);
};
//토스트 메시지 1초 보여주기
const toastMessage = () => {
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1000);
};

const loadUser = async () => {
  const email = document.querySelector('.user-email');
  const nicknameInput = document.getElementById('nickname');
  const profileImage = document.querySelector('.profile-image');
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      credentials: 'include'
    });
    
    if(!response.ok) {
      throw new Error('유저 조회를 실패했습니다.');   
    }

    const result = await response.json();
    //유저 정보 채우기
    email.textContent = result.data.email;
    nicknameInput.value = result.data.nickname;
    profileImage.src = result.data.profile_image;

  } catch (error) {
    throw new Error('유저 조회를 실패했습니다.', error);
  }
}
//유저 정보 수정 api
const updateUser = async (nicknameInput) => {
  const profileImage = document.querySelector('.profile-image');

  const userData = {
    nickname: nicknameInput.value,
    profile_image: profileImage.src
  }
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if(!response.ok) {
      throw new Error('유저 수정을 실패했습니다.');       
    }
  } catch (error) {
    throw new Error('유저 수정을 실패했습니다.', error);
  }
}
//이미지 올리는 함수(s3로 올리는건 따로 구현해야함)
const loadImage = (fileInput) => {
  fileInput.addEventListener("change", (event) => {
    const fileReader = new FileReader();
    //이미지 하나만 등록
    const image = event.target.files[0];
    const profileImage = document.querySelector('.profile-image');
    
    if (image) {
      //선택된 파일 저장
      selectedImageFile = image;
      //이미지를 읽어서 원에 넣기
      fileReader.onload = (e) => {
        profileImage.src = e.target.result;      
      };    
      fileReader.readAsDataURL(image); 
    } 
  });
};
//이미지 변경(원 안에만 변경 src는 추후 구현)
const changeImage = () => {
  const fileInput = document.getElementById('file-input');
  const modifyFileBtn = document.querySelector('.modify-file-btn');

  modifyFileBtn.addEventListener('click', () => {
    fileInput.click();
  });

  loadImage(fileInput);
}


