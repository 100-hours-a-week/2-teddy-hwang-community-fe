/**
 * 제목은 26자까지 작성 가능
 * 27자 이상 작성시 작성 안됨
 */
const titleMaxLength = function (input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
};
//title enter키 입력 방지
const titleBanEnter = function () {
  const title = document.getElementById("title");
  //enter키 막기
  title.addEventListener("keydown", (event) => {
    if (event.code === "Enter") event.preventDefault();
  });
};
/**
 * 완료버튼
 * 제목 및 본문이 다 작성되면 ACA0EB -> 7F6AEE
 * 버튼 클릭시 제목, 본문이 작성 안되어 있으면 제목,내용을 모두 작성해주세요
 */
const completeBtn = function () {
  const completeBtn = document.getElementById("create-btn");
  const helpertext = document.getElementById("helpertext");
  const title = document.getElementById("title");
  const content = document.getElementById("content");

  // 제목과 본문 작성 여부에 따라 버튼 색상 변경
  const completeBtnStyle = () => {
    if (title.value.trim() !== "" && content.value.trim() !== "") {
      completeBtn.style.backgroundColor = "#7F6AEE"; // 활성화 색상
    } else {
      completeBtn.style.backgroundColor = "#ACA0EB"; // 비활성화 색상
    }
  };

  title.addEventListener("input", completeBtnStyle);
  content.addEventListener("input", completeBtnStyle);

  completeBtn.addEventListener("click", () => {
    if (title.value.trim() == "" || content.value.trim() == "") {
      helpertext.textContent = "제목,내용을 모두 작성해주세요";
    } else {
      helpertext.textContent = "";
      console.log("제출 완료!", title.value, content.value);
      //이후 완료 로직 처리
    }
  });
};
/**
 * 파일 선택 누르면 컴퓨터에서 이미지 파일 업로드
 * 파일명 보여주기
 */
const uploadImage = function () {
  const selectFileBtn = document.getElementById("select-file-btn");
  const fileInput = document.getElementById("file-input");

  selectFileBtn.addEventListener("click", () => {
    fileInput.click();
  });

  loadImage(fileInput);
};
//이미지 업로드
const loadImage = function (fileInput) {
  fileInput.addEventListener("change", (event) => {
    const fileName = document.getElementById("file-name");
    const fileReader = new FileReader();
    //이미지 하나만 등록
    const profileImage = event.target.files[0];

    if (profileImage) {
      fileName.textContent = profileImage.name;
      //이미지 이름 띄우는거 까진됨 보내는 로직은 추후 작성
    }
  });
};

titleBanEnter();
completeBtn();
uploadImage();
