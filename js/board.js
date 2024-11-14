//프로필 이미지 클릭 시 드롭다운
const dropdown = function(){
    const profileImage = document.querySelector(".account-image");
    const dropdown = document.getElementById('dropdown');

    //프로필 클릭하면 드롭다운
    profileImage.addEventListener('click', () => {
        dropdown.style.display = 'block'; 
        dropdown.classList.toggle('show');   
    });
    //마우스가 영역 밖으로 나가면 사라지게하기
    dropdown.addEventListener('mouseleave', () => {
        dropdown.style.display = 'none'; 
        dropdown.classList.remove('show');   
    }); 
}
/**
 * 게시글 작성 버튼을 누를 시 게시글 작성 페이지로 이동
 */
const createPostBtn = function(){
    const createPostBtn = document.getElementById('create-board-btn');
    createPostBtn.addEventListener('click', () => {
        location.href = '../html/board-create.html';
    });
};
//게시글 뿌리기
const displayBoard = function(){
    document.addEventListener('DOMContentLoaded', () => {
        fetch('../data/post.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // JSON 데이터로 변환
        })
        .then(data => {
            const boardContainer = document.querySelector('.board-container');
            // data.post 배열을 순회하면서 각 게시글을 동적으로 HTML에 추가
            data.post.forEach(element => {
                fetch('../data/user.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json(); // JSON 데이터로 변환
                })
                .then(userData => {
                    const user = userData.user.find(u => u.user_id === element.user_id);
                    if(user){
                        const boardArticle = document.createElement('article'); // 새로운 <article> 생성
                        boardArticle.classList.add('board'); // 'board' 클래스 추가
                        boardArticle.setAttribute('id', `${element.post_id}`); // 'id' 속성에 post_id 추가

                        // 게시글 내용 작성
                        boardArticle.innerHTML = `
                            <span class="title">${element.title}</span>
                            <article class="board-info">
                                <span class="like-count">좋아요 ${element.like_count}</span>
                                <span class="reply-count">댓글 ${element.comment_count}</span>
                                <span class="view-count">조회수 ${element.view_count}</span>
                                <span class="created-at">${element.created_at}</span>
                            </article>
                            <hr> 
                            <article class="user-info">
                            <span class="box">
                                <img class="profile-image" src="${user.profile_image}" alt="Profile Image">
                            </span>
                            <span class="username">${user.nickname}</span>
                        </article>     
                        `;

                        // 클릭 이벤트 추가
                        boardArticle.addEventListener('click', () => {
                            location.href = `../html/board-detail.html?postId=${element.post_id}`;
                            
                        });

                        // 각 게시글을 boardContainer에 추가
                        boardContainer.appendChild(boardArticle);
                    }else {
                        console.error(`User with id ${element.user_id} not found`);
                    }
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });              
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    });
}
dropdown();
createPostBtn();
displayBoard();