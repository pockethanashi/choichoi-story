const API_URL = "https://script.google.com/macros/s/AKfycbxOD1kbaefm1VYuiQqLI8a9xapYeRtncyTLPAmZBQpvinI-D311QIhtkxhkBJXxsX_njQ/exec";

// ページ読み込み時にローカルストレージからデータを表示
document.addEventListener("DOMContentLoaded", () => {
  const title = localStorage.getItem("kobanashi_title");
  const body = localStorage.getItem("kobanashi_body");
  const genre = localStorage.getItem("kobanashi_genre");
  const author = localStorage.getItem("kobanashi_author");
  const profile = localStorage.getItem("kobanashi_profile");

  document.getElementById("confirm-title").innerText = title;
  document.getElementById("confirm-body").innerText = body;
  document.getElementById("confirm-genre").innerText = genre;
  document.getElementById("confirm-author").innerText = author;
  document.getElementById("confirm-profile").innerText = profile;
});

// 投稿ボタンが押されたときの処理
document.getElementById("submitBtn").addEventListener("click", () => {
  const title = localStorage.getItem("kobanashi_title");
  const body = localStorage.getItem("kobanashi_body");
  const genre = localStorage.getItem("kobanashi_genre");
  const author = localStorage.getItem("kobanashi_author");
  const profile = localStorage.getItem("kobanashi_profile");

  if (!title || !body || !author) {
    alert("データが不完全です。入力フォームに戻って再入力してください。");
    window.location.href = "post.html";
    return;
  }

  const postData = {
    action: "post",
    title,
    body,
    genre,
    author,
    profile
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("投稿が完了しました！（メールも送信されました）");
        localStorage.clear(); // 一時データを削除
        window.location.href = "index.html";
      } else {
        alert("投稿に失敗しました: " + data.error);
      }
    })
    .catch(error => {
      console.error("❌ 投稿エラー:", error);
      alert("通信エラーが発生しました。時間を置いて再試行してください。");
    });
});
