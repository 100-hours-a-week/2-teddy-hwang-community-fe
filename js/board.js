document.addEventListener('DOMContentLoaded', () => {
  initializeBoard();
  createPostBtn();
});

// 페이징 상태 관리를 위한 변수
let currentPage = 1;
let isLoading = false;
let hasMore = true;

/**
 * 게시글 작성 버튼을 누를 시 게시글 작성 페이지로 이동
 */
const createPostBtn = () => {
  const createPostBtn = document.getElementById('create-board-btn');
  createPostBtn.addEventListener('click', () => {
    location.href = `/posts/create`;
  });
};

// 게시글의 HTML 요소 생성 함수
const createBoardArticle = post => {
  const boardArticle = document.createElement('article');
  boardArticle.classList.add('board');
  boardArticle.setAttribute('id', `${post.post_id}`);

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

  boardArticle.addEventListener('click', () => {
    location.href = `/posts/${post.post_id}`;
  });

  return boardArticle;
};

// 초기화 및 스크롤 이벤트 설정
const initializeBoard = () => {
  displayBoard();

  // 스크롤 이벤트 리스너 추가
  window.addEventListener('scroll', handleScroll);
};
// 스크롤 관련 함수
const handleScroll = () => {
  if (isLoading || !hasMore) return;

  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const clientHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // 스크롤이 하단에서 100px 이내로 가까워졌을 때 추가 데이터 로드
  if (scrollHeight - scrollTop - clientHeight < 100) {
    currentPage++;
    displayBoard();
  }
};
// 게시판을 렌더링하는 함수
const displayBoard = async () => {
  try {
    if (isLoading) return;

    isLoading = true;
    const postData = await apiGet(
      `${address}/api/posts?page=${currentPage}&limit=10`,
    );
    const boardContainer = document.querySelector('.board-container');

    // 더이상 불러올 게시글이 없는 경우
    if (postData.data.data.posts.length === 0) {
      hasMore = false;
      isLoading = false;
      return;
    }
    postData.data.data.posts.forEach(post => {
      const boardArticle = createBoardArticle(post);
      boardContainer.appendChild(boardArticle);
    });

    hasMore = postData.data.data.hasMore;
    isLoading = false;
  } catch (error) {
    console.error('잘못된 요청입니다.', error);
    isLoading = false;
  }
};
/**
 * 좋아요수, 댓글수, 조회수
 * 1000이상 1k
 * 10000이상 10k
 * 100000이상 100k
 */
const numToK = num => {
  if (num >= 100000) {
    return Math.floor(num / 1000) + 'k';
  } else if (num >= 10000) {
    return Math.floor(num / 1000) + 'k';
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + 'k';
  } else {
    return num;
  }
};
