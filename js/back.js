//뒤로가기
const back = function(){
    const backIcon = document.querySelector('.material-icons');
    console.log(backIcon);

    backIcon.addEventListener('click', () => {
        history.back();
    });
}

back();