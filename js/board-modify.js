document.addEventListener('DOMContentLoaded', () => {
    loadPost();
    uploadImage();
    updatePost();
});
//경로 파라미터 추출
const pathname = window.location.pathname;
const postId = Number(pathname.split('/')[2]); 
const userId = Number(sessionStorage.getItem('userId'));

let boardImage = "";

//데이터를 가져오는 함수
const fetchData = async (url) => {
    const response = await fetch(url, {
        credentials: 'include'
    });
    if (!response.ok) throw new Error(`네트워크 에러: ${url}`);
    return await response.json();
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
        const response = await fetchData(`${address}/api/posts/${postId}`);
        title.value = response.data.title;
        content.value = response.data.content;
        //파일명 추출
        const decodeFilename = decodeURIComponent(response.data.post_image);
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
    fileInput.addEventListener("change", (event) => {
        const fileName = document.getElementById("file-name");
        const fileReader = new FileReader();
        //이미지 하나만 등록
        const image = event.target.files[0];

        if (image) {
          fileName.textContent = image.name;
          boardImage = image;
        }
    });
};
//게시글 수정
const updatePost = () => {
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const helpertext = document.querySelector('.helpertext');
    const modifyBtn = document.getElementById('modify-btn');
    const fileName = document.getElementById("file-name");
    modifyBtn.addEventListener("click", async () => {
        if (title.value.trim() === "" || content.value.trim() === "") {
          helpertext.textContent = "제목,내용을 모두 작성해주세요";
        } else {
          helpertext.textContent = ""; 
          
          //수정할 데이터(이미지, 유저ID 추후 수정)
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
            const response = await fetch(`${address}/api/posts/${postId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData
            });

            if(!response.ok){
                throw new Error('글 수정에 실패했습니다.')
            }

            location.href = `/posts/${postId}`;
          } catch (error) {
            throw new Error('글 수정에 실패했습니다.', error);
          }        
        }
    });
}