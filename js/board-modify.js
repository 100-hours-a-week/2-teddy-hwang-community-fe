document.addEventListener('DOMContentLoaded', async () => {
    await loadPost();
    uploadImage();
    updatePost();
});
//경로 파라미터 추출
const pathname = window.location.pathname;
const postId = Number(pathname.split('/')[2]); 
const userId = authManager.getUserInfo()?.id;

let boardImage = "";
/**
 * 제목은 26자까지 작성 가능
 * 27자 이상 작성시 작성 안됨
 */
const titleMaxLength = (input, maxLength) => {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
};
/**
 * 1. 글 조회
 * 2. 제목, 내용, 이미지에 넣어주기
 */
const loadPost = async () => {
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const fileName = document.querySelector('.file-name');

    try {
        //해당 글 조회
        const response = await apiGet(`${address}/api/posts/${postId}`);
        title.value = response.data.data.title;
        content.value = response.data.data.content;
        boardImage = response.data.data.post_image;
        //파일명 추출
        const decodeFilename = decodeURIComponent(response.data.data.post_image);
        const originalFilename = decodeFilename.split('/').pop();
        //UUID 이후 문자열은 파일명
        const realFilename = originalFilename.replace(/^.*?-[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}-/, '');
        fileName.textContent = realFilename;
    } catch (error) {
        throw new Error('게시글 조회에 실패했습니다.', error);
    }
}
/** 
 * 파일 선택 누르면 컴퓨터에서 이미지 파일 업로드
 * 파일명 보여주기
 */
const uploadImage = () => {
    const selectFileBtn = document.getElementById("select-file-btn");
    const fileInput = document.getElementById("file-input");
  
    selectFileBtn.addEventListener("click", () => {
      fileInput.click();
    });
  
    loadImage(fileInput);
  };
//이미지 업로드
const loadImage = (fileInput) => {
  const fileName = document.querySelector('.file-name');
    fileInput.addEventListener("change", (event) => {
      if (event.target.files.length === 0) {
        fileName.textContent = "";
        boardImage = "";
        return;
      }
    
        // 이미지 하나만 등록
        const image = event.target.files[0];
        fileName.textContent = image.name;
        boardImage = image;
    });
    // fileInput의 click 이벤트에서 처리
    fileInput.addEventListener("click", () => {
      // 클릭했을 때 기존값 초기화
      fileName.textContent = "";
      boardImage = "";
  });
};
//게시글 수정
const updatePost = async () => {
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const helpertext = document.querySelector('.helpertext');
    const modifyBtn = document.querySelector('.modify-btn');

    // 버튼 상태 업데이트 함수
    const updateButtonState = () => {
        const isTitleValid = title.value.trim() !== "";
        const isContentValid = content.value.trim() !== "";
        
        if (isTitleValid && isContentValid) {
            modifyBtn.classList.add('active');
            helpertext.textContent = ""; 
            modifyBtn.disabled = false;
        } else {
            modifyBtn.classList.remove('active');
            helpertext.textContent = "*제목,내용을 모두 작성해주세요";
            modifyBtn.disabled = true;
        }
    };

    // 초기 버튼 상태 설정
    updateButtonState();

    // 입력값 변경시마다 버튼 상태 업데이트
    title.addEventListener('input', updateButtonState);
    content.addEventListener('input', updateButtonState);
  
    modifyBtn.addEventListener("click", async () => {             
        const formData = new FormData();

        formData.append('title', title.value);
        formData.append('content', content.value);
        formData.append('user_id', userId);
        
        //이미지 파일이 없을 때도 처리
        if (boardImage) {
          formData.append('image', boardImage);
        }else {
          formData.append('image', "");
        }
    
        try {
          //게시글 수정 api 호출
          const response = await apiPatchFormData(`${address}/api/posts/${postId}`, formData);

          if(!response.response.ok){
              throw new Error('글 수정에 실패했습니다.')
          }

          location.href = `/posts/${postId}`;
        } catch (error) {
          throw new Error('글 수정에 실패했습니다.', error);
        }        
        
    });
}