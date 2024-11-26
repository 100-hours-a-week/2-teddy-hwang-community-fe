//뒤로가기
const back = function () {
  const backIcon = document.querySelector(".material-icons");

  backIcon.addEventListener("click", () => {
    location.href = document.referrer;
  });
};

back();
