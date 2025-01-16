// 폼 상태 관리
const formState = {
  isValid: {
    profileImage: false,
    email: false,
    password: false,
    nickname: false
  },
  values: {
    profileImage: '',
    email: '',
    password: '',
    nickname: ''
  }
 };
 
 // 유효성 검사 규칙
 const validators = {
  email: (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  },
  password: (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,20}$/.test(password);
  },
  nickname: (nickname) => {
    return /^[^\s]{1,10}$/.test(nickname);
  }
 };
 
 // 에러 메시지
 const errorMessages = {
  profileImage: "*프로필 사진을 추가해주세요.",
  email: {
    empty: "*이메일을 입력해주세요.",
    invalid: "*올바른 이메일 주소를 입력해주세요.(예:example@example.com)",
    duplicate: "*중복된 이메일 입니다."
  },
  password: {
    empty: "*비밀번호를 입력해주세요.",
    invalid: "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.",
    mismatch: "*비밀번호가 다릅니다.",
    confirmEmpty: "*비밀번호를 한번 더 입력해주세요."
  },
  nickname: {
    empty: "*닉네임을 입력해주세요.",
    space: "*띄어쓰기를 없애주세요.",
    length: "*닉네임은 최대 10자 까지 작성 가능합니다.",
    duplicate: "*중복된 닉네임 입니다."
  }
 };
 
 // 프로필 이미지 업로드 처리
 const handleProfileImage = () => {
  const uploadCircle = document.getElementById("upload-circle");
  const fileInput = document.getElementById("file-input");
  const profileHelpertext = document.getElementById("profile-helpertext");
  const crossContainer = document.getElementById("cross-container");
 
  uploadCircle.addEventListener("click", () => fileInput.click());
 
  fileInput.addEventListener("change", (event) => {
    const fileReader = new FileReader();
    const image = event.target.files[0];
 
    if (image) {
      fileReader.readAsDataURL(image);
      fileReader.onload = (e) => {
        uploadCircle.style.backgroundImage = `url(${e.target.result})`;
        formState.values.profileImage = image;
      };
      profileHelpertext.textContent = "";
      crossContainer.style.display = "none";
      formState.isValid.profileImage = true;
    } else {
      uploadCircle.style.backgroundImage = "none";
      crossContainer.style.display = "flex";
      profileHelpertext.textContent = errorMessages.profileImage;
      formState.isValid.profileImage = false;
    }
    updateSubmitButton();
  });
 };
 
 // 이메일 유효성 검사
 const handleEmailValidation = async (emailInput, helpertext) => {
  const email = emailInput.value.trim();
  
  if (!email) {
    helpertext.textContent = errorMessages.email.empty;
    formState.isValid.email = false;
    return;
  }
 
  if (!validators.email(email)) {
    helpertext.textContent = errorMessages.email.invalid;
    formState.isValid.email = false;
    return;
  }
 
  try {
    const response = await fetchData(`${address}/api/users/email/${email}`);
    if (!response.data) {
      helpertext.textContent = errorMessages.email.duplicate;
      formState.isValid.email = false;
      return;
    }
    helpertext.textContent = "";
    formState.isValid.email = true;
    formState.values.email = email;
  } catch (error) {
    helpertext.textContent = "*이메일 확인 중 오류가 발생했습니다.";
    formState.isValid.email = false;
  }
  updateSubmitButton();
 };
 
// 비밀번호 입력칸 유효성 검사
const handlePasswordValidation = (passwordInput, passwordHelpertext) => {
  const password = passwordInput.value;
  const passwordCheckInput = document.getElementById("password-check");

  if (!password) {
    passwordHelpertext.textContent = errorMessages.password.empty;
    formState.isValid.password = false;
    // 비밀번호가 비어있으면 비밀번호 확인 입력 비활성화
    passwordCheckInput.disabled = true;
    return;
  }

  if (!validators.password(password)) {
    passwordHelpertext.textContent = errorMessages.password.invalid;
    formState.isValid.password = false;
    // 비밀번호가 유효하지 않으면 비밀번호 확인 입력 비활성화
    passwordCheckInput.disabled = true;
    return;
  }

  // 비밀번호가 유효하면
  passwordHelpertext.textContent = "";
  formState.values.password = password;
  // 비밀번호 확인 입력 활성화
  passwordCheckInput.disabled = false;

  // 비밀번호 확인 입력칸에 포커스를 강제로 이동시킴
  if (passwordCheckInput.disabled === false) {
    passwordCheckInput.focus();
  }
  
  // 비밀번호 확인 입력값이 있다면 확인 검증 실행
  if (passwordCheckInput.value) {
    handlePasswordCheckValidation(passwordInput, passwordCheckInput, document.getElementById("password-check-helpertext"));
  }

  updateSubmitButton();
};

// 비밀번호 확인칸 유효성 검사
const handlePasswordCheckValidation = (passwordInput, passwordCheckInput, passwordCheckHelpertext) => {
  const password = passwordInput.value;
  const passwordCheck = passwordCheckInput.value;

  if (!passwordCheck) {
    passwordCheckHelpertext.textContent = errorMessages.password.confirmEmpty;
    formState.isValid.password = false;
    return;
  }

  if (password !== passwordCheck) {
    passwordCheckHelpertext.textContent = errorMessages.password.mismatch;
    formState.isValid.password = false;
    return;
  }

  // 비밀번호 일치
  passwordCheckHelpertext.textContent = "";
  formState.isValid.password = true;
  updateSubmitButton();
};
 
 // 닉네임 유효성 검사
 const handleNicknameValidation = async (nicknameInput, helpertext) => {
  const nickname = nicknameInput.value.trim();
 
  if (!nickname) {
    helpertext.textContent = errorMessages.nickname.empty;
    formState.isValid.nickname = false;
    return;
  }
 
  if (nickname.includes(" ")) {
    helpertext.textContent = errorMessages.nickname.space;
    formState.isValid.nickname = false;
    return;
  }
 
  // 닉네임 유효성 검사가 실패한 경우
  if (!validators.nickname(nickname)) {
    // 띄어쓰기 체크
    if (nickname.includes(" ")) {
      helpertext.textContent = errorMessages.nickname.space;
    } 
    // 길이 체크
    else if (nickname.length > 10) {
      helpertext.textContent = errorMessages.nickname.length;
    }
    formState.isValid.nickname = false;
    updateSubmitButton();
    return;
  }
 
  try {
    const response = await fetchData(`${address}/api/users/signup/nickname/${nickname}`);
    if (!response.data) {
      helpertext.textContent = errorMessages.nickname.duplicate;
      formState.isValid.nickname = false;
      return;
    }
    helpertext.textContent = "";
    formState.isValid.nickname = true;
    formState.values.nickname = nickname;
  } catch (error) {
    helpertext.textContent = "*닉네임 확인 중 오류가 발생했습니다.";
    formState.isValid.nickname = false;
  }
  updateSubmitButton();
 };
 
 // 제출 버튼 상태 업데이트
 const updateSubmitButton = () => {
  const submitButton = document.getElementById("create-user-btn");
  const isFormValid = Object.values(formState.isValid).every(Boolean);
 
  submitButton.style.backgroundColor = isFormValid ? "#7F6AEE" : "#ACA0EB";
  submitButton.disabled = !isFormValid;
 };
 
 // 폼 제출 처리
 const handleSubmit = async (event) => {
  event.preventDefault();
  
  const formData = new FormData();
  formData.append('email', formState.values.email);
  formData.append('password', formState.values.password);
  formData.append('nickname', formState.values.nickname);
  formData.append('image', formState.values.profileImage || "");
 
  try {
    const response = await fetch(`${address}/api/users`, {
      method: 'POST',
      body: formData
    });
 
    if (!response.ok) throw new Error('회원가입에 실패했습니다.');
    const result = await response.json();
    if (result) location.href = '/';
  } catch (error) {
    console.error('회원가입 실패:', error);
  }
 };
 
 // 초기화
 document.addEventListener('DOMContentLoaded', () => {
  handleProfileImage();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordCheckInput = document.getElementById("password-check");
  const nicknameInput = document.getElementById("nickname");
  const submitButton = document.getElementById("create-user-btn");

  // 비밀번호 확인 입력칸 초기 비활성화
  passwordCheckInput.disabled = true;

  emailInput.addEventListener('blur', () => {
    handleEmailValidation(emailInput, document.getElementById("email-helpertext"));
  });

  passwordInput.addEventListener('blur', () => {
    handlePasswordValidation(
      passwordInput,
      document.getElementById("password-helpertext")
    );
  });

  passwordCheckInput.addEventListener('blur', () => {
    handlePasswordCheckValidation(
      passwordInput,
      passwordCheckInput,
      document.getElementById("password-check-helpertext")
    );
  });

  nicknameInput.addEventListener('blur', () => {
    handleNicknameValidation(nicknameInput, document.getElementById("nickname-helpertext"));
  });

  submitButton.addEventListener('click', handleSubmit);
});
 
 // API 호출 유틸리티
 const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`네트워크 에러: ${url}`);
  return await response.json();
 };