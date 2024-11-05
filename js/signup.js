//프로필 이미지 올리기
const uploadProfileImage = function() {
    const uploadCircle = document.getElementById('upload-circle');
    const fileInput = document.getElementById('file-input');
    //동그라미 클릭 시 file-input이 클릭되도록 설정
    uploadCircle.addEventListener("click", () => {
        fileInput.click();
    });      
    loadImage(fileInput, uploadCircle);
};

//이미지 불러오기
const loadImage = function(fileInput, uploadCircle) {
    fileInput.addEventListener("change", (event) => {
        //이미지는 하나만 등록 가능
        const fileReader = new FileReader();
        const profileImage = event.target.files[0];
        const profileHelpertext = document.getElementById('profile-helpertext');
        const crossContainer = document.getElementById('cross-container');

        if(profileImage){
            fileReader.readAsDataURL(profileImage);
            fileReader.onload = (e) => {
                const base64Data = fileReader.result;
                uploadCircle.style.backgroundImage = `url(${base64Data})`;
            }
            profileHelpertext.textContent = '';
            crossContainer.style.display = 'none';
        }else{
            uploadCircle.style.backgroundImage = 'none';
            crossContainer.style.display = 'flex';
            profileHelpertext.textContent = '*프로필 사진을 추가해주세요.';
        }
    });
};

uploadProfileImage();