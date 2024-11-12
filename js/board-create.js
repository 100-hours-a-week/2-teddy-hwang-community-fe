//뒤로가기
const back = function(){
    const backIcon = document.querySelector('.material-icons');

    backIcon.addEventListener('click', () => {
        history.back();
    });
}
//프로필 이미지 클릭 시 드롭다운
const dropdown = function(){
    const profileImage = document.getElementById("profile-image");
    const dropdown = document.getElementById('dropdown');

    //프로필 클릭하면 드롭다운
    profileImage.addEventListener('click', () => {
        dropdown.style.display = 'block'; 
        dropdown.classList.toggle('show');   
    });
    //마우스가 영역 밖으로 나가면 사라지게하기
    dropdown.addEventListener('mouseleave', () => {
        dropdown.style.display = 'none'; 
        dropdown.classList.remove('show');   
    }); 
}
/**
 * 제목은 26자까지 작성 가능
 * 27자 이상 작성시 작성 안됨
 */
const titleMaxLength = function(input, maxLength){
    if(input.value.length > maxLength){
        input.value = input.value.slice(0, maxLength);
    }
}
//title enter키 입력 방지
const titleBanEnter = function(){
    const title = document.getElementById('title');
    //enter키 막기
    title.addEventListener('keydown', (event) => {
        if(event.code === 'Enter') event.preventDefault();
    });
}
/**
 * 완료버튼
 * 제목 및 본문이 다 작성되면 ACA0EB -> 7F6AEE
 * 버튼 클릭시 제목, 본문이 작성 안되어 있으면 제목,내용을 모두 작성해주세요
 */
const completeBtn = function(){
    const completeBtn = document.getElementById('create-btn');
    const helpertext = document.getElementById('helpertext');
    const title = document.getElementById('title');
    const content = document.getElementById('content');

    // 제목과 본문 작성 여부에 따라 버튼 색상 변경
    const completeBtnStyle = () => {
        if (title.value.trim() !== '' && content.value.trim() !== '') {
            completeBtn.style.backgroundColor = '#7F6AEE'; // 활성화 색상
        } else {
            completeBtn.style.backgroundColor = '#ACA0EB'; // 비활성화 색상
        }
    };

    title.addEventListener('input', completeBtnStyle);
    content.addEventListener('input', completeBtnStyle);

    completeBtn.addEventListener('click', () => {
        if(title.value.trim() == '' || content.value.trim() == ''){
            helpertext.textContent = '제목,내용을 모두 작성해주세요';
        }else{
            helpertext.textContent = '';
            console.log("제출 완료!", title.value, content.value);
            //이후 완료 로직 처리
        }
    });
}
/**
 * 파일 선택 누르면 컴퓨터에서 이미지 파일 업로드
 * 파일명 보여주기
 */
const uploadImage = function(){
    const selectFileBtn = document.getElementById('select-file-btn');
    const fileInput = document.getElementById('file-input');

    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    loadImage(fileInput);
}
//이미지 업로드
const loadImage = function(fileInput){
    fileInput.addEventListener("change", (event) => {
        const fileName = document.getElementById('file-name');
        const fileReader = new FileReader();
        //이미지 하나만 등록
        const profileImage = event.target.files[0];
        
        if(profileImage){
            fileName.textContent = profileImage.name;
            const imageUrl = profileImage.imageUrl;
            console.log(imageUrl);
        }
    });
};


back();
dropdown();
titleBanEnter();
completeBtn();
uploadImage();