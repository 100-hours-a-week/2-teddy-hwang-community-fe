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

back();
dropdown();