document.addEventListener("DOMContentLoaded", () => {
  displayBoard();
});
/**
 * 게시글 작성 버튼을 누를 시 게시글 작성 페이지로 이동
 */
const createPostBtn = function () {
  const createPostBtn = document.getElementById("create-board-btn");
  createPostBtn.addEventListener("click", () => {
    location.href = "../html/board-create.html";
  });
};
//게시글 데이터를 가져오는 함수
const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`네트워크 에러: ${url}`);
  return await response.json();
};

//게시글의 HTML 요소 생성 함수
const createBoardArticle = (post, user) => {
  const boardArticle = document.createElement("article");
  boardArticle.classList.add("board");
  boardArticle.setAttribute("id", `${post.post_id}`);
  boardArticle.innerHTML = `
        <span class="title">${post.title}</span>
        <article class="board-info">
            <span class="like-count">좋아요 ${numToK(post.like_count)}</span>
            <span class="reply-count">댓글 ${numToK(post.comment_count)}</span>
            <span class="view-count">조회수 ${numToK(post.view_count)}</span>
            <span class="created-at">${post.created_at}</span>
        </article>
        <hr> 
        <article class="user-info">
            <span class="box">
                <img class="profile-image" src="${user.profile_image}" alt="Profile Image">
            </span>
            <span class="username">${user.nickname}</span>
        </article>     
    `;

  boardArticle.addEventListener("click", () => {
    location.href = `../html/board-detail.html?postId=${post.post_id}`;
  });

  return boardArticle;
};

//게시판을 렌더링하는 함수
const displayBoard = async () => {
  try {
    const postData = await fetchData("../data/post.json");
    const userData = await fetchData("../data/user.json");
    const boardContainer = document.querySelector(".board-container");

    postData.post.forEach((post) => {
      const user = userData.user.find((u) => u.user_id === post.user_id);
      if (user) {
        const boardArticle = createBoardArticle(post, user);
        boardContainer.appendChild(boardArticle);
      } else {
        console.error(`유저 ID가 ${post.user_id} 없습니다.`);
      }
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
const numToK = function (num) {
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

createPostBtn();
