document.addEventListener('DOMContentLoaded', () => {
  uploadProfileImage();
  emailInput();
  passwordInput();
  nicknameInput();
});
let profileImageValid = false;
let emailValid = false;
let passwordValid = false;
let nicknameValid = false;


/**
 * 프로필 이미지 올리기
 * 동그라미 클릭 시 file-input이 클릭되도록 설정
 */
const uploadProfileImage = () => {
  const uploadCircle = document.getElementById("upload-circle");
  const fileInput = document.getElementById("file-input");

  uploadCircle.addEventListener("click", () => {
    fileInput.click();
  });

  loadImage(fileInput, uploadCircle);
};
let profileImageData = ""; // 프로필 이미지의 base64 데이터
let emailData = "";
let passwordData = "";
let nicknameData = "";
/**
 * @param fileInput -> 이미지를 불러올 수 있는 창을 열어줌
 * @param uploadCircle -> 프로필 이미지가 들어갈 원
 * 이미지 불러오기
 * 이미지는 하나만 등록 가능
 * 이미지가 있다면 이미지를 원에 넣기 -> helpertext 없애기 -> 십자가 없애기
 */
const loadImage = (fileInput, uploadCircle) => {
  fileInput.addEventListener("change", (event) => {
    const fileReader = new FileReader();
    //이미지 하나만 등록
    const profileImage = event.target.files[0];
    const profileHelpertext = document.getElementById("profile-helpertext");
    const crossContainer = document.getElementById("cross-container");

    if (profileImage) {
      //이미지를 읽어서 원에 넣기
      fileReader.readAsDataURL(profileImage);
      fileReader.onload = (e) => {
        const base64Data = fileReader.result;
        profileImageData = base64Data;
        uploadCircle.style.backgroundImage = `url(${base64Data})`;
      };
      //helpertext 없애고 십자가 없애기
      profileHelpertext.textContent = "";
      crossContainer.style.display = "none";
      profileImageValid = true;
    } else {
      uploadCircle.style.backgroundImage = "none";
      crossContainer.style.display = "flex";
      profileHelpertext.textContent = "*프로필 사진을 추가해주세요.";
      profileImageValid = false;
    }

    createUserBtnState();
  });
};
/**
 * 이메일 유효성 검사
 * 인풋 값을 입력하다 포커스 아웃됐을 때 helpertext 띄워야함
 * 이메일이 비어있는 경우 -> *이메일을 입력해주세요.
 * 이메일 형식이 안맞는 경우 -> *올바른 이메일 주소를 입력해주세요.(예:example@example.com)
 * 중복된 이메일인 경우 -> *중복된 이메일 입니다.
 */
const emailInput = () => {
  const emailInput = document.getElementById("email");
  const emailHelpertext = document.getElementById("email-helpertext");

  emailInput.addEventListener("blur", async () => {
    const emailValue = emailInput.value;

    //이메일이 비어있는 경우
    if (emailValue === "") {
      emailHelpertext.textContent = "*이메일을 입력해주세요.";
      emailValid = false;
      return;
    }   

    //이메일 형식이 안맞는 경우
    if (!emailIsValid(emailValue)) {
      emailHelpertext.textContent =
        "*올바른 이메일 주소를 입력해주세요.(예:example@example.com)";
      emailValid = false;
      return;
    } else {
      //이메일 중복시
      const existByEmail = await fetchData(`${address}/api/users/email/${emailValue}`);
      if(!existByEmail.data) {
        emailHelpertext.textContent = "*중복된 이메일 입니다.";
        emailValid = false;
        return;
      }
    }

    emailHelpertext.textContent = "";
    emailValid = true;
    emailData = emailValue;
    createUserBtnState();
    return;
  });
};
//이메일 유효성 검사 함수
const emailIsValid = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
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
  const passwordCheckHelpertext = document.getElementById(
    "password-check-helpertext",
  );

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
    createUserBtnState();
  });

  passwordCheckInput.addEventListener("blur", () => {
    showPasswordError(passwordCheckInput.value, passwordCheckHelpertext, true);
    createUserBtnState();
  });
};
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
 * 닉네임 입력 조건
 * 닉네임 유효성: 띄어쓰기 불가, 10글자 이내
 * 닉네임 입력하지 않을 시: *닉네임을 입력해주세요.
 * 닉네임 띄어쓰기 입력 시: *띄어쓰기를 없애주세요.
 * 닉네임 중복 시: *중복된 닉네임 입니다.
 * 닉네임 11자 이상 작성시: *닉네임은 최대 10자 까지 작성 가능합니다.
 */
const nicknameInput = () => {
  const nicknameInput = document.getElementById("nickname");
  const nicknameHelpertext = document.getElementById("nickname-helpertext");

  const showNicknameError = async (nickname) => {
    //닉네임을 입력하지 않은 경우
    if (nickname === "") {
      nicknameHelpertext.textContent = "*닉네임을 입력해주세요.";
      nicknameValid = false;
      return;
    }
    if (!nicknameIsValid(nickname)) {
      //닉네임에 띄어쓰기가 포함된 경우
      if (nickname.includes(" ")) {
        nicknameHelpertext.textContent = "*띄어쓰기를 없애주세요.";
        nicknameValid = false;
        return;
      }
      //닉네임 길이가 10글자 초과하는 경우
      if (nickname.length > 10) {
        nicknameHelpertext.textContent =
          "*닉네임은 최대 10자 까지 작성 가능합니다.";
        nicknameValid = false;
        return;
      }
    }else {
      //닉네임 중복시 
      const existByEmail = await fetchData(`${address}/api/users/nickname/${nickname}`);
      if(!existByEmail.data) {
        nicknameHelpertext.textContent = "*중복된 닉네임 입니다.";
        nicknameValid = false;
        return;
      }
    }
    nicknameHelpertext.textContent = "";
    nicknameValid = true;
    return;
  };

  nicknameInput.addEventListener("blur", () => {
    showNicknameError(nicknameInput.value);
    createUserBtnState();
  });
};

const nicknameIsValid = (nickname) => {
  //띄어쓰기 없이 최대 10글자
  const nicknamePattern = /^[^\s]{1,10}$/;
  return nicknamePattern.test(nickname);
};

const createUserBtnState = () => {
  try {
    const createUserBtn = document.getElementById("create-user-btn");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const nickname = document.getElementById("nickname").value;
    //모든 조건 만족 시
    if (profileImageValid && emailValid && passwordValid && nicknameValid) {
      createUserBtn.style.backgroundColor = "#7F6AEE";
      createUserBtn.disabled = false;

      createUserBtn.addEventListener('click', async () => {
        //body 데이터
        const userData = {
          email: email,
          password: password,
          nickname: nickname,
          profile_image: ".jpg"
        }
        //POST 요청
        const response = await fetch(`${address}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        if(!response.ok) throw new Error('회원가입에 실패했습니다.');

        const result = await response.json();
        if(result) location.href = '/';
      });     
    } else {
      createUserBtn.style.backgroundColor = "#ACA0EB";
      createUserBtn.disabled = true;
    }
  }catch(error) {
    throw new Error('회원가입에 실패했습니다', error);
  }
};
//데이터를 가져오는 함수
const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`네트워크 에러: ${url}`);
  return await response.json();
};
