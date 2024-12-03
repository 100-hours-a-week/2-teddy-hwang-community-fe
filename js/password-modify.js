document.addEventListener('DOMContentLoaded', () => {
    passwordInput();
});

let passwordValid = false;
const userId = Number(sessionStorage.getItem('userId'));

/**
 * @param password -> 입력받은 비밀번호
 * 비밀번호는 8자리 이상 20자리 이하
 * 대문자, 소문자, 숫자, 특수문자 최소 한개씩 포함
 */
const passwordIsValid = (password) => {
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
    const passwordInput = document.getElementById("password");
    const passwordCheckInput = document.getElementById("password-check");
    const passwordHelpertext = document.getElementById("password-helpertext");
    const passwordCheckHelpertext = document.getElementById("password-check-helpertext");
  
    // 비밀번호 오류 메시지 처리 함수
    const showPasswordError = (inputValue, helpertext, checkMatch) => {
      // 비밀번호 확인 검사
      if (checkMatch) {
        // 비밀번호 확인 입력이 비어있는 경우
        if (passwordCheckInput.value === "") {
          helpertext.textContent = "*비밀번호를 한번 더 입력해주세요.";
          passwordValid = false;
          return;
        }
        // 비밀번호와 비밀번호 확인 값이 일치하지 않는 경우
        if (passwordInput.value !== passwordCheckInput.value) {
          helpertext.textContent = "*비밀번호가 다릅니다.";
          passwordHelpertext.textContent = "*비밀번호가 다릅니다.";
          passwordValid = false;
          return;
        } else {
          helpertext.textContent = "";
          passwordHelpertext.textContent = "";
          passwordValid = true;
        }
      }
      // 비밀번호 입력이 비어있는 경우
      if (inputValue === "") {
        helpertext.textContent = "*비밀번호를 입력해주세요.";
        passwordValid = false;
        return;
      }
  
      // 비밀번호 형식이 맞지 않는 경우
      if (!passwordIsValid(inputValue)) {
        helpertext.textContent =
          "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        passwordValid = false;
        return;
      } else {
        helpertext.textContent = "";
      }
  
      passwordValid = checkMatch;
      return;
    };
  
    passwordInput.addEventListener("blur", () => {
      showPasswordError(passwordInput.value, passwordHelpertext, false);
      modifyBtnState();
    });
  
    passwordCheckInput.addEventListener("blur", () => {
      showPasswordError(passwordCheckInput.value, passwordCheckHelpertext, true);
      modifyBtnState();
    });
};

const modifyBtnState = () => {
    try {
      const modifyBtn = document.getElementById("modify-btn");
      const password = document.getElementById("password").value;
    
      //모든 조건 만족 시
      if (passwordValid) {
        modifyBtn.style.backgroundColor = "#7F6AEE";
        modifyBtn.disabled = false;
  
        modifyBtn.addEventListener('click', async () => {
          //body 데이터
          const passwordData = {
            password: password,
          }
          //PATCH 요청
          const response = await fetch(`http://localhost:8080/api/users/${userId}/password`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(passwordData)
          });
  
          if(!response.ok) throw new Error('비밀번호 수정에 실패했습니다.');
  
          const result = await response.json();
          if(result) location.href = '/';
        });     
      } else {
        modifyBtn.style.backgroundColor = "#ACA0EB";
        modifyBtn.disabled = true;
      }
    }catch(error) {
      throw new Error('비밀번호 수정에 실패했습니다', error);
    }
};


  