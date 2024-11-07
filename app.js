const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

//경로 설정
app.use(express.static(path.join(__dirname)));

//로그인
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'));
});
//회원가입
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/signup.html'));
});
//게시글 목록 조회
app.get('/boards', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/board.html'));
});
//게시글 상세 조회
app.get('/board', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/board-detail.html'));
});
//게시글 추가
app.get('/board/create', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/board-create.html'));
});
//게시글 수정
app.get('/board/modify', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/board-modify.html'));
});
//회원정보 수정
app.get('/user/modify', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/user-modify.html'));
});
//비밀번호 수정
app.get('/user/password', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/password-modify.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});