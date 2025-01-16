// 폼 상태 관리
const formState = {
  isValid: {
    email: false,
    password: false
  },
  values: {
    email: '',
    password: ''
  }
 };
 
 // 유효성 검사 규칙
 const validators = {
  email: (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  },
  password: (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,20}$/.test(password);
  }
 };
 
 // 에러 메시지
 const errorMessages = {
  email: {
    empty: "*이메일을 입력해주세요.",
    invalid: "*올바른 이메일 주소를 입력해주세요.(예:example@example.com)"
  },
  password: {
    empty: "*비밀번호를 입력해주세요.",
    invalid: "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.",
    mismatch: "*비밀번호가 다릅니다."
  }
 };
 
 // 이메일 유효성 검사
 const handleEmailValidation = (emailInput, helpertext) => {
  const email = emailInput.value.trim();
 
  if (!email) {
    helpertext.textContent = errorMessages.email.empty;
    formState.isValid.email = false;
    updateLoginButton();
    return;
  }
 
  if (!validators.email(email)) {
    helpertext.textContent = errorMessages.email.invalid;
    formState.isValid.email = false;
    updateLoginButton();
    return;
  }
 
  helpertext.textContent = "";
  formState.isValid.email = true;
  formState.values.email = email;
  updateLoginButton();
 };
 
 // 비밀번호 유효성 검사
 const handlePasswordValidation = (passwordInput, helpertext) => {
  const password = passwordInput.value;
 
  if (!password) {
    helpertext.textContent = errorMessages.password.empty;
    formState.isValid.password = false;
    updateLoginButton();
    return;
  }
 
  if (!validators.password(password)) {
    helpertext.textContent = errorMessages.password.invalid;
    formState.isValid.password = false;
    updateLoginButton();
    return;
  }
 
  helpertext.textContent = "";
  formState.isValid.password = true;
  formState.values.password = password;
  updateLoginButton();
 };
 
 // 로그인 버튼 상태 업데이트
 const updateLoginButton = () => {
  const loginButton = document.getElementById("login-btn");
  const isFormValid = Object.values(formState.isValid).every(Boolean);
 
  loginButton.style.backgroundColor = isFormValid ? "#7F6AEE" : "#ACA0EB";
  loginButton.disabled = !isFormValid;
 };
 // 로그인 처리
 const handleLogin = async (helpertext) => {
  try {
    const response = await fetch(`${address}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: formState.values.email,
        password: formState.values.password
      })
    });
 
    const result = await response.json();
 
    if (response.status === 401) {
      helpertext.textContent = result.message;
      return;
    }
 
    if (!response.ok) {
      throw new Error('로그인에 실패했습니다.');
    }

    // Access Token 저장
    if (result.data.accessToken) {
      authManager.setAccessToken(result.data.accessToken);
    }

    location.href = '/posts';
 
  } catch (error) {
    console.error('로그인 실패:', error);
  }
 };
 
 // 초기화
 document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const helpertext = document.getElementById("helpertext");
  const loginButton = document.getElementById("login-btn");
 
  // 입력 이벤트 리스너
  emailInput.addEventListener('input', () => handleEmailValidation(emailInput, helpertext));
  passwordInput.addEventListener('input', () => handlePasswordValidation(passwordInput, helpertext));
  
  // 로그인 버튼 클릭 이벤트
  loginButton.addEventListener('click', () => handleLogin(helpertext));
 
  // 초기 버튼 상태 설정
  updateLoginButton();
 });