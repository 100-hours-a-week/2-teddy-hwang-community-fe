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
    title.addEventListener()
}


back();
dropdown();
titleBanEnter();