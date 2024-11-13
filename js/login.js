/**
 * 이메일 유효성 검사
 * 인풋 값을 입력하다 포커스 아웃됐을 때 helpertext 띄워야함
 * 이메일 형식이 안맞는 경우 -> *올바른 이메일 주소를 입력해주세요.(예:example@example.com)
 * 중복된 이메일인 경우 -> *중복된 이메일 입니다.
 */
const emailInput = function(){
    const emailInput = document.getElementById('email');
    const helpertext = document.getElementById('helpertext');

    emailInput.addEventListener('input', () => {
        const emailValue = emailInput.value;
        
        //이메일이 비어있는 경우
        if(emailValue === ''){
            helpertext.textContent = '*이메일을 입력해주세요.';
            emailValid = false;
            return;
        }

        //이메일 형식이 안맞는 경우
        if(!emailIsValid(emailValue)){
            helpertext.textContent = '*올바른 이메일 주소를 입력해주세요.(예:example@example.com)';
            emailValid = false;
            return;
        }else{
            helpertext.textContent = '';
            emailValid = true;
            loginBtnState();
            return;
        }
       
    });
};
//이메일 유효성 검사 함수
const emailIsValid = function(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailPattern.test(email);
};

/**
 * 비밀번호 유효성 검사 -> *비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.
 * 비밀번호 입력 안했을 시 -> *비밀번호를 입력해주세요.
 */
const passwordInput = function() {
    const passwordInput = document.getElementById('password');
    const helperText = document.getElementById('helpertext');

     // 비밀번호 오류 메시지 처리 함수
     const showPasswordError = function(inputValue, helperText){
        // 비밀번호 입력이 비어있는 경우
        if (inputValue === '') {
            helperText.textContent = '*비밀번호를 입력해주세요.';
            passwordValid = false;
            return;
        }

        // 비밀번호 형식이 맞지 않는 경우
        if (!passwordIsValid(inputValue)) {
            helperText.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
            passwordValid = false;
            return;
        }else{
            helperText.textContent = '';
        }    

        passwordValid = true;
        return;
    };

    passwordInput.addEventListener('input', () => {
        showPasswordError(passwordInput.value, helperText);
        loginBtnState();
    });
    
};
/**
 * @param password -> 입력받은 비밀번호
 * 비밀번호는 8자리 이상 20자리 이하
 * 대문자, 소문자, 숫자, 특수문자 최소 한개씩 포함
 */
const passwordIsValid = function(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,20}$/
    return passwordPattern.test(password);
};

let emailValid = false;
let passwordValid = false;

const loginBtnState = function(){
    const loginBtn = document.getElementById('login-btn');
    if(emailValid && passwordValid){
        loginBtn.style.backgroundColor = '#7F6AEE';
    } else {
        loginBtn.style.backgroundColor = '#ACA0EB';
    }
};

/**
 * 추후 작성
 * 로그인 로직 작성
 * 로그인 버튼 클릭 시 게시글 목록 조회로 이동
 */
const login = function(){
    const loginBtn = document.getElementById('login-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const helpertext = document.getElementById('helpertext');

    loginBtn.addEventListener('click', () => {
        fetch('../data/user.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // JSON 데이터로 변환
        })
        .then(data => {
            const user = data.user.find(u => u.email === emailInput.value && u.password === passwordInput.value);
            if (user) {
                location.href = '../html/board.html';
            } else {
                helpertext.textContent = '*비밀번호가 다릅니다.'
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
      
}

emailInput();
passwordInput();
login();