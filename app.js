const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

//경로 설정
app.use(express.static(path.join(__dirname)));


//로그인
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/login.html")); // 로그인
});
//회원가입
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/signup.html")); // 회원가입
});
//게시글 목록 조회
app.get("/posts", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/board.html")); // 목록
});
//게시글 생성
app.get("/posts/create", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/board-create.html")); // 생성
});
//게시글 상세 조회
app.get("/posts/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/board-detail.html")); // 상세
});
//게시글 수정
app.get("/posts/:id/edit", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/board-modify.html")); // 수정
});
//유저 정보 수정
app.get("/users/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/user-modify.html")); // 프로필 수정
});
//비밀번호 수정
app.get("/users/password", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/password-modify.html")); // 비밀번호 수정
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
