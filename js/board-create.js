//뒤로가기
const back = function(){
    const backIcon = document.querySelector('.material-icons');

    backIcon.addEventListener('click', () => {
        history.back();
    });
}

back();