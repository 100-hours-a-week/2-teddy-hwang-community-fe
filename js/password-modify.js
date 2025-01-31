document.addEventListener('DOMContentLoaded', () => {
  passwordInput();
});

let passwordValid = false;
const userId = authManager.getUserInfo()?.id;

/**
 * @param password -> 입력받은 비밀번호
 * 비밀번호는 8자리 이상 20자리 이하
 * 대문자, 소문자, 숫자, 특수문자 최소 한개씩 포함
 */
const passwordIsValid = password => {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,20}$/;
  return passwordPattern.test(password);
};
/**
 * 비밀번호 유효성 검사 -> *비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.
 * 비밀번호 입력 안했을 시 -> *비밀번호를 입력해주세요.
 * 비밀번호가 확인과 다를 시 -> *비밀번호가 다릅니다.
 * 비밀번호 확인 입력 안했을 시 -> *비밀번호를 한번더 입력해주세요.
 */
const passwordInput = () => {
  const passwordInput = document.getElementById('password');
  const passwordCheckInput = document.getElementById('password-check');
  const passwordHelpertext = document.getElementById('password-helpertext');
  const passwordCheckHelpertext = document.getElementById(
    'password-check-helpertext',
  );

  // 비밀번호와 비밀번호 확인 모두 유효한지 추적
  let isPasswordValid = false;
  let isPasswordMatchValid = false;

  // 초기에 비밀번호 확인 입력 비활성화
  passwordCheckInput.disabled = true;

  const validatePassword = password => {
    if (!password) {
      return {
        isValid: false,
        message: '*비밀번호를 입력해주세요.',
      };
    }

    if (!passwordIsValid(password)) {
      return {
        isValid: false,
        message:
          '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.',
      };
    }

    return {
      isValid: true,
      message: '',
    };
  };

  const validatePasswordMatch = (password, passwordCheck) => {
    if (!passwordCheck) {
      return {
        isValid: false,
        message: '*비밀번호를 한번 더 입력해주세요.',
      };
    }

    if (password !== passwordCheck) {
      return {
        isValid: false,
        message: '*비밀번호가 다릅니다.',
      };
    }

    return {
      isValid: true,
      message: '',
    };
  };

  const updatePasswordUI = (validation, helpertext, isMatch = false) => {
    helpertext.textContent = validation.message;

    // 비밀번호 확인인 경우
    if (isMatch) {
      isPasswordMatchValid = validation.isValid;
    } else {
      isPasswordValid = validation.isValid;
    }

    // 둘 다 유효할 때만 passwordValid를 true로 설정
    passwordValid = isPasswordValid && isPasswordMatchValid;
    modifyBtnState();
  };

  // 비밀번호 입력 필드 이벤트
  passwordInput.addEventListener('input', () => {
    const validation = validatePassword(passwordInput.value);
    updatePasswordUI(validation, passwordHelpertext);

    // 비밀번호가 유효하면 확인 입력 활성화
    passwordCheckInput.disabled = !validation.isValid;

    // 비밀번호가 변경되면 확인 필드 초기화
    if (passwordCheckInput.value) {
      passwordCheckInput.value = '';
      passwordCheckHelpertext.textContent = '';
      isPasswordMatchValid = false;
      passwordValid = false;
      modifyBtnState();
    }
  });

  // 비밀번호 확인 필드 이벤트
  passwordCheckInput.addEventListener('input', () => {
    const matchValidation = validatePasswordMatch(
      passwordInput.value,
      passwordCheckInput.value,
    );
    updatePasswordUI(matchValidation, passwordCheckHelpertext, true);

    // 비밀번호가 다른 경우 에러 메시지 표시
    if (!matchValidation.isValid && passwordCheckInput.value) {
      passwordCheckHelpertext.textContent = matchValidation.message;
    }
  });
};

const modifyBtnState = () => {
  try {
    const modifyBtn = document.getElementById('modify-btn');
    const password = document.getElementById('password').value;

    //모든 조건 만족 시
    if (passwordValid) {
      modifyBtn.classList.add('active');
      modifyBtn.disabled = false;

      modifyBtn.addEventListener('click', async () => {
        const headers = await authManager.getAuthHeader();
        headers['Content-Type'] = 'application/json';
        //body 데이터
        const passwordData = {
          password: password,
        };
        //PATCH 요청
        const response = await apiPatch(
          `${address}/api/users/${userId}/password`,
          JSON.stringify(passwordData),
        );

        if (!response.response.ok)
          throw new Error('비밀번호 수정에 실패했습니다.');

        if (response) {
          toastMessage();
        }
      });
    } else {
      modifyBtn.classList.remove('active');
      modifyBtn.disabled = true;
    }
  } catch (error) {
    throw new Error('비밀번호 수정에 실패했습니다', error);
  }
};

// 토스트 메시지 2초 보여주기
const toastMessage = () => {
  const toast = document.getElementById('toast');
  toast.classList.add('show');

  // 클릭 차단
  document.body.classList.add('body-block');
  setTimeout(() => {
    toast.classList.remove('show');
    // 클릭 차단 해제
    document.body.classList.remove('body-block');
    logout();
  }, 2000);
};

// 로그아웃 로직 및 로그인 창으로 이동
const logout = async () => {
  try {
    const response = await fetch(`${address}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include', // Refresh Token 쿠키를 위해 필요
    });

    if (!response.ok) {
      throw new Error('로그아웃에 실패했습니다.');
    }

    // 클라이언트 측 토큰 제거
    authManager.removeAccessToken();

    window.location.href = '/';
  } catch (error) {
    console.error('로그아웃에 실패했습니다.', error);

    authManager.removeAccessToken();
    window.location.href = '/';
  }
};
