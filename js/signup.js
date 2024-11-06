/**
 * 프로필 이미지 올리기
 * 동그라미 클릭 시 file-input이 클릭되도록 설정
 */ 
const uploadProfileImage = function(){
    const uploadCircle = document.getElementById('upload-circle');
    const fileInput = document.getElementById('file-input');
    
    uploadCircle.addEventListener("click", () => {
        fileInput.click();
    });      
    
    loadImage(fileInput, uploadCircle);
};

/** 
 * @param fileInput -> 이미지를 불러올 수 있는 창을 열어줌
 * @param uploadCircle -> 프로필 이미지가 들어갈 원
 * 이미지 불러오기
 * 이미지는 하나만 등록 가능
 * 이미지가 있다면 이미지를 원에 넣기 -> helpertext 없애기 -> 십자가 없애기
 */
const loadImage = function(fileInput, uploadCircle){
    fileInput.addEventListener("change", (event) => {
        const fileReader = new FileReader();
        //이미지 하나만 등록
        const profileImage = event.target.files[0];
        const profileHelpertext = document.getElementById('profile-helpertext');
        const crossContainer = document.getElementById('cross-container');

        if(profileImage){
            //이미지를 읽어서 원에 넣기
            fileReader.readAsDataURL(profileImage);
            fileReader.onload = (e) => {
                const base64Data = fileReader.result;
                uploadCircle.style.backgroundImage = `url(${base64Data})`;
            }
            //helpertext 없애고 십자가 없애기
            profileHelpertext.textContent = '';
            crossContainer.style.display = 'none';
        }else{
            uploadCircle.style.backgroundImage = 'none';
            crossContainer.style.display = 'flex';
            profileHelpertext.textContent = '*프로필 사진을 추가해주세요.';
        }
    });
};
/**
 * 이메일 유효성 검사
 * 인풋 값을 입력하다 포커스 아웃됐을 때 helpertext 띄워야함
 * 이메일이 비어있는 경우 -> *이메일을 입력해주세요.
 * 이메일 형식이 안맞는 경우 -> *올바른 이메일 주소를 입력해주세요.(예:example@example.com)
 * 중복된 이메일인 경우 -> *중복된 이메일 입니다.
 */
const emailInput = function(){
    const emailInput = document.getElementById('email');
    const emailHelpertext = document.getElementById('email-helpertext');

    emailInput.addEventListener('blur', () => {
        const emailValue = emailInput.value;
        
        //이메일이 비어있는 경우
        if(emailValue === ''){
            emailHelpertext.textContent = '*이메일을 입력해주세요.';
            return;
        }

        //중복된 이메일인 경우(서버 만들고 추후 추가)


        //이메일 형식이 안맞는 경우
        if(!emailIsValid(emailValue)){
            emailHelpertext.textContent = '*올바른 이메일 주소를 입력해주세요.(예:example@example.com)';
            return;
        }else{
            emailHelpertext.textContent = '';
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
 * 비밀번호가 확인과 다를 시 -> *비밀번호가 다릅니다.
 * 비밀번호 확인 입력 안했을 시 -> *비밀번호를 한번더 입력해주세요.
 */
const passwordInput = function() {
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('password-check');
    const passwordHelpertext = document.getElementById('password-helpertext');
    const passwordCheckHelpertext = document.getElementById('password-check-helpertext');

     // 비밀번호 오류 메시지 처리 함수
     const showPasswordError = function(inputValue, helpertext, checkMatch = false){
        // 비밀번호 확인 검사
        if (checkMatch) {
            // 비밀번호 확인 입력이 비어있는 경우
            if (passwordCheckInput.value === '') {
                helpertext.textContent = '*비밀번호를 한번 더 입력해주세요.';
                return false;
            }
            // 비밀번호와 비밀번호 확인 값이 일치하지 않는 경우
            if (passwordInput.value !== passwordCheckInput.value) {
                helpertext.textContent = '*비밀번호가 다릅니다.';
                passwordHelpertext.textContent = '*비밀번호가 다릅니다.';
                return false;
            }else{
                helpertext.textContent = '';
                passwordHelpertext.textContent = '';
            }
        }
        // 비밀번호 입력이 비어있는 경우
        if (inputValue === '') {
            helpertext.textContent = '*비밀번호를 입력해주세요.';
            return false;
        }

        // 비밀번호 형식이 맞지 않는 경우
        if (!passwordIsValid(inputValue)) {
            helpertext.textContent = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
            return false;
        }    

        helpertext.textContent = '';
        return true;
    };

    passwordInput.addEventListener('blur', () => {
        showPasswordError(passwordInput.value, passwordHelpertext);
    });

    passwordCheckInput.addEventListener('blur', () => {
        showPasswordError(passwordCheckInput.value, passwordCheckHelpertext, checkMatch = true);
    })
    
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



uploadProfileImage();
emailInput();
passwordInput();