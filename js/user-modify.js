document.addEventListener('DOMContentLoaded', async () => {
  await loadUser();
  window.scrollTo(0, document.documentElement.scrollHeight * 0.1);
  await nicknameInput();
  changeImage();
  userDeleteText();
  userModal();

  document.querySelector('form').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 엔터 입력 시 기본 동작(제출) 방지
    }
  });
});
let nicknameValid = false;
const modalContainer = document.querySelector('.modal-container');
const body = document.body;

const userId = authManager.getUserInfo()?.id;
let selectedImageFile = '';

// 공통으로 사용할 스타일 설정 함수
const openModal = modal => {
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
 * 회원탈퇴 클릭 시 모달 창 띄움
 */
const userDeleteText = () => {
  const userDeleteText = document.getElementById('user-delete');
  const userModal = document.getElementById('user-modal');

  userDeleteText.addEventListener('click', () => {
    openModal(userModal);
  });
};
//회원탈퇴 모달창 취소, 확인
const userModal = async () => {
  const userCancelBtn = document.getElementById('user-cancel-btn');
  const userCheckBtn = document.getElementById('user-check-btn');
  const headers = await authManager.getAuthHeader();
  //취소
  userCancelBtn.addEventListener('click', () => {
    closeModal();
  });
  //확인
  userCheckBtn.addEventListener('click', async () => {
    //탈퇴 처리
    try {
      const response = await apiDelete(`${address}/api/users/${userId}`);

      if (!response.response.ok) {
        throw new Error('회원탈퇴에 실패했습니다');
      }

      // 로그아웃 처리
      await fetch(`${address}/api/auth/logout`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      // Access Token 삭제
      authManager.refreshAccessToken();

      //로그인으로 이동
      location.href = '/';
    } catch (error) {
      throw new Error('회원탈퇴에 실패했습니다', error);
    }
  });
};

/**
 * 수정하기 버튼 클릭했을 때
 * 닉네임 입력X -> *닉네임을 입력해주세요.
 * 닉네임 중복시 -> *중복된 닉네임 입니다.
 * 닉네임 11자 이상 작성시 -> *닉네임은 최대 10자 까지 작성 가능합니다.
 */
const nicknameInput = async () => {
  const nicknameInput = document.getElementById('nickname');
  const modifyBtn = document.getElementById('modify-btn');
  const helpertext = document.getElementById('helpertext');

  const initializeState = () => {
    if (nicknameInput.value.trim()) {
      nicknameValid = true;
      updateButtonState(nicknameValid);
      helpertext.textContent = '';
    }
  };

  initializeState(); // 함수 호출

  const showNicknameError = async nickname => {
    //닉네임을 입력하지 않은 경우
    if (nickname === '') {
      helpertext.textContent = '*닉네임을 입력해주세요.';
      nicknameValid = false;
      updateButtonState(nicknameValid);
      return;
    }
    if (!nicknameIsValid(nickname)) {
      //닉네임에 띄어쓰기가 포함된 경우
      if (nickname.includes(' ')) {
        helpertext.textContent = '*띄어쓰기를 없애주세요.';
        nicknameValid = false;
        updateButtonState(nicknameValid);
        return;
      }
      //닉네임 길이가 10글자 초과하는 경우
      if (nickname.length > 10) {
        helpertext.textContent = '*닉네임은 최대 10자 까지 작성 가능합니다.';
        nicknameValid = false;
        updateButtonState(nicknameValid);
        return;
      }
    }

    try {
      const response = await apiGet(
        `${address}/api/users/profile/nickname/${nickname}`,
      );

      // 닉네임 중복시
      if (!response.data.data) {
        helpertext.textContent = '*중복된 닉네임 입니다.';
        nicknameValid = false;
        updateButtonState(nicknameValid);
        return;
      } else {
        helpertext.textContent = '';
        nicknameValid = true;
        updateButtonState(nicknameValid);
        return;
      }
    } catch (error) {
      throw new Error('닉네임 중복 확인에 실패했습니다', error);
    }
  };

  nicknameInput.addEventListener('input', async () => {
    await showNicknameError(nicknameInput.value);
  });

  modifyBtn.addEventListener('click', async () => {
    if (nicknameValid) {
      await updateUser(nicknameInput);
      toastMessage();
    }
  });
};

const nicknameIsValid = nickname => {
  //띄어쓰기 없이 최대 10글자
  const nicknamePattern = /^[^\s]{1,10}$/;
  return nicknamePattern.test(nickname);
};

//닉네임 유효성 검사 후 색상 및 버튼 상태 변경
const updateButtonState = isValid => {
  const modifyBtn = document.getElementById('modify-btn');

  if (isValid) {
    modifyBtn.disabled = false;
    modifyBtn.classList.add('active');
  } else {
    modifyBtn.disabled = true;
    modifyBtn.classList.remove('active');
  }
};

// 토스트 메시지 2초 보여주고 게시글 창으로 이동
const toastMessage = () => {
  const toast = document.getElementById('toast');
  toast.classList.add('show');

  // 클릭 차단
  document.body.classList.add('body-block');
  setTimeout(() => {
    toast.classList.remove('show');
    // 클릭 차단 해제
    document.body.classList.remove('body-block');
    location.href = '/posts';
  }, 2000);
};

const loadUser = async () => {
  const email = document.querySelector('.user-email');
  const nicknameInput = document.getElementById('nickname');
  const profileImage = document.querySelector('.profile-image');
  try {
    const response = await apiGet(`${address}/api/users/${userId}`);

    if (!response.response.response.ok) {
      throw new Error('유저 조회를 실패했습니다.');
    }

    //유저 정보 채우기
    email.textContent = response.data.data.email;
    nicknameInput.value = response.data.data.nickname;
    profileImage.src = response.data.data.profile_image;
    selectedImageFile = response.data.data.profile_image;
  } catch (error) {
    throw new Error('유저 조회를 실패했습니다.', error);
  }
};
//유저 정보 수정 api
const updateUser = async nicknameInput => {
  const formData = new FormData();
  formData.append('nickname', nicknameInput.value);
  formData.append('image', selectedImageFile);

  try {
    const response = await apiPatchFormData(
      `${address}/api/users/${userId}/profile`,
      formData,
    );

    if (!response.response.ok) {
      throw new Error('유저 수정을 실패했습니다.');
    }

    const profileImage = document.querySelector('.profile-image');

    //유저 정보 업데이트
    profileImage.src = response.data.data.profile_image;
    nicknameInput.value = response.data.data.nickname;

    //헤더 프로필 이미지 업데이트
    await updateHeaderProfileImage(response.data.data.profile_image);

    // 새로운 accessToken 발급 받기
    const newToken = await authManager.refreshAccessToken();
    if (!newToken) {
      throw new Error('토큰 갱신에 실패했습니다.');
    }
  } catch (error) {
    throw new Error('유저 수정을 실패했습니다.', error);
  }
};

//헤더의 프로필 이미지 업데이트 함수
const updateHeaderProfileImage = async newProfileImage => {
  try {
    // 헤더에서 프로필 이미지 요소 찾기
    const headerProfileImage = document.querySelector('.account-image');
    if (headerProfileImage) {
      headerProfileImage.src = newProfileImage;
    }
  } catch (error) {
    console.error('헤더 프로필 이미지 업데이트 실패:', error);
  }
};

const changeImage = () => {
  const fileInput = document.getElementById('file-input');
  const modifyFileBtn = document.querySelector('.modify-file-btn');
  const profileImage = document.querySelector('.profile-image');

  // 파일 선택 창 열기
  modifyFileBtn.addEventListener('click', () => {
    fileInput.click();
  });

  // 파일 선택 후 change 이벤트 리스너 추가
  fileInput.addEventListener('change', event => {
    const fileReader = new FileReader();
    const image = event.target.files[0]; // 선택한 파일

    // 파일을 선택하지 않았을 경우
    if (!image) {
      profileImage.src = basicProfileImage; // 기본 이미지로 되돌리기
      selectedImageFile = basicProfileImage;
    } else {
      // 이미지가 선택되었을 경우
      selectedImageFile = image;
    }

    // 이미지 파일 읽기
    fileReader.onload = e => {
      profileImage.src = e.target.result; // 프로필 이미지에 새 이미지 적용
    };

    // 선택된 이미지 파일을 읽기
    fileReader.readAsDataURL(image);
  });

  // click 이벤트에서 취소 처리
  fileInput.addEventListener('click', () => {
    // 파일이 비어있는 경우 취소가 된 것으로 판단
    if (fileInput.value.length === 0) {
      profileImage.src = basicProfileImage; // 기본 이미지로 되돌리기
      selectedImageFile = basicProfileImage;
    }
  });
};
