document.addEventListener('DOMContentLoaded', () => {
  titleBanEnter();
  completeBtn();
  uploadImage();
});
let boardImage = '';
const userId = authManager.getUserInfo()?.id;

/**
 * 제목은 26자까지 작성 가능
 * 27자 이상 작성시 작성 안됨
 */
const titleMaxLength = (input, maxLength) => {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
};
//title enter키 입력 방지
const titleBanEnter = () => {
  const title = document.getElementById('title');
  //enter키 막기
  title.addEventListener('keydown', event => {
    if (event.code === 'Enter') event.preventDefault();
  });
};
/**
 * 완료버튼
 * 제목 및 본문이 다 작성되면 ACA0EB -> 7F6AEE
 * 버튼 클릭시 제목, 본문이 작성 안되어 있으면 제목,내용을 모두 작성해주세요
 */
const completeBtn = () => {
  const completeBtn = document.getElementById('create-btn');
  const helpertext = document.getElementById('helpertext');
  const title = document.getElementById('title');
  const content = document.getElementById('content');

  // 제목과 본문 작성 여부에 따라 버튼 색상 변경
  const completeBtnStyle = () => {
    const isTitleValid = title.value.trim() !== '';
    const isContentValid = content.value.trim() !== '';

    if (isTitleValid && isContentValid) {
      completeBtn.classList.add('active');
      helpertext.textContent = '';
      completeBtn.disabled = false;
    } else {
      completeBtn.classList.remove('active');
      helpertext.textContent = '*제목,내용을 모두 작성해주세요';
      completeBtn.disabled = true;
    }
  };

  // 초기 버튼 상태 설정
  completeBtnStyle();

  title.addEventListener('input', completeBtnStyle);
  content.addEventListener('input', completeBtnStyle);

  completeBtn.addEventListener('click', async () => {
    // 클릭 시 글 생성
    await createBoard(title.value, content.value, boardImage);
  });
};
//게시글 저장 함수
const createBoard = async (title, content, image) => {
  try {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    formData.append('user_id', userId);

    //이미지 파일이 없을 때도 처리
    if (image) {
      formData.append('image', image);
    } else {
      formData.append('image', '');
    }

    const response = await apiPostFormData(`${address}/api/posts`, formData);

    if (!response.response.ok) {
      throw new Error('게시글 저장에 실패했습니다');
    }

    location.href = `/posts/${response.data.data.post_id}`;
  } catch (error) {
    throw new Error('게시글을 저장하는데 오류가 발생했습니다.', error);
  }
};
/**
 * 파일 선택 누르면 컴퓨터에서 이미지 파일 업로드
 * 파일명 보여주기
 */
const uploadImage = () => {
  const selectFileBtn = document.getElementById('select-file-btn');
  const fileInput = document.getElementById('file-input');

  selectFileBtn.addEventListener('click', () => {
    fileInput.click();
  });

  loadImage(fileInput);
};
//이미지 업로드
const loadImage = fileInput => {
  const fileName = document.getElementById('file-name');
  fileInput.addEventListener('change', event => {
    if (event.target.files.length === 0) {
      fileName.textContent = '파일을 선택해주세요.'; // 파일명 초기화
      boardImage = ''; // 게시글 이미지 초기화
      return;
    }

    // 이미지 하나만 등록
    const image = event.target.files[0];
    fileName.textContent = image.name;
    boardImage = image;
  });
};
