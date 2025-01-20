document.addEventListener("DOMContentLoaded", () => {
  displayBoard();
  createPostBtn();
});

/**
 * 게시글 작성 버튼을 누를 시 게시글 작성 페이지로 이동
 */
const createPostBtn = () => {
  const createPostBtn = document.getElementById("create-board-btn");
  createPostBtn.addEventListener("click", () => {
    location.href = `/posts/create`;
  });
};
//게시글 데이터를 가져오는 함수
const fetchData = async (url) => {
  const headers = await authManager.getAuthHeader();
  
  const response = await fetch(url, {
    headers,
    credentials: 'include'
  });

  if (!response.ok) throw new Error(`네트워크 에러: ${url}`);
  return await response.json();
};

//게시글의 HTML 요소 생성 함수
const createBoardArticle = (post) => {
  const boardArticle = document.createElement("article");
  boardArticle.classList.add("board");
  boardArticle.setAttribute("id", `${post.post_id}`);

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('title');
  titleSpan.textContent = post.title;



  const content = document.createElement('div');
  content.innerHTML = `
        <article class="board-info">
            <span class="like-count">좋아요 ${numToK(post.like_count)}</span>
            <span class="reply-count">댓글 ${numToK(post.comment_count)}</span>
            <span class="view-count">조회수 ${numToK(post.view_count)}</span>
            <span class="created-at">${post.modified_at}</span>
        </article>
        <hr> 
        <article class="user-info">
            <span class="box">
                <img class="profile-image" src="${post.author.profile_image}" alt="Profile Image">
            </span>
        </article>     
    `;

  const usernameSpan = document.createElement('span');
  usernameSpan.classList.add('username');
  usernameSpan.textContent = post.author.nickname;
  
  boardArticle.appendChild(titleSpan);
  boardArticle.appendChild(content);
  content.querySelector('.user-info').appendChild(usernameSpan);
  
  boardArticle.addEventListener("click", () => {
    location.href = `/posts/${post.post_id}`;
  });

  return boardArticle;
};

//게시판을 렌더링하는 함수
const displayBoard = async () => {
  try {
    const postData = await fetchData(`${address}/api/posts`);
    const boardContainer = document.querySelector(".board-container");

    postData.data.forEach((post) => {
      const boardArticle = createBoardArticle(post);
      boardContainer.appendChild(boardArticle);
    });
    
  } catch (error) {
    console.error("잘못된 요청입니다.", error);
  }
};
/**
 * 좋아요수, 댓글수, 조회수
 * 1000이상 1k
 * 10000이상 10k
 * 100000이상 100k
 */
const numToK = (num) => {
  if (num >= 100000) {
    return Math.floor(num / 1000) + "k";
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + "k";
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + "k";
  } else {
    return num;
  }
};