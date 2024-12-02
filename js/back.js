document.addEventListener('DOMContentLoaded', () => {
  back();
});
//뒤로가기
const back = () => {
  const backIcon = document.querySelector(".material-icons");

  backIcon.addEventListener("click", () => {
    location.href = document.referrer;
  });
};

