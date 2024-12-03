document.addEventListener('DOMContentLoaded', () => {
  back();
});
//뒤로가기
const back = () => {
  const backIcon = document.querySelector(".material-icons");

  backIcon.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/'; // 메인 페이지 URL로 변경하세요
      }
  });
};

