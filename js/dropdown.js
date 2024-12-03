document.addEventListener('DOMContentLoaded', () => {
  fetch('/html/dropdown.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('dropdown-container').innerHTML = data;

    //dropdown.html이 로드된 이후에 초기화
    dropdown();
    link();
  })
});

//프로필 이미지 클릭 시 드롭다운
const dropdown = () => {
  const profileImage = document.querySelector(".account-image");
  const dropdown = document.getElementById("dropdown");

  //프로필 클릭하면 드롭다운
  profileImage.addEventListener("click", () => {
    dropdown.style.display = "block";
    dropdown.classList.toggle("show");
  });
  //마우스가 영역 밖으로 나가면 사라지게하기
  dropdown.addEventListener("mouseleave", () => {
    dropdown.style.display = "none";
    dropdown.classList.remove("show");
  });
};
//드롭다운 링크
const link = () => {
  const userId = sessionStorage.getItem('userId');
  const userModifyLink = document.getElementById('user-modify-link');
  const passwordModifyLink = document.getElementById('password-modify-link');
  const logoutLink = document.getElementById('logout-link');
  
  userModifyLink.addEventListener('click', () => {
    window.location.href = `/users/${userId}/profile`;
  });

  passwordModifyLink.addEventListener('click', () => {
    window.location.href = `/users/${userId}/password`;
  });

  logoutLink.addEventListener('click', () => {
    window.location.href = `/`;
  });
}
