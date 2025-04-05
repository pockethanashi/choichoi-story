document.getElementById("send-btn").addEventListener("click", function () {
  const name = document.getElementById("confirm-name").textContent;
  const email = document.getElementById("confirm-email").textContent;
  const message = document.getElementById("confirm-message").textContent;

  const postData = {
    action: "contact",
    name,
    email,
    message
  };

  const API_URL = "https://script.google.com/macros/s/AKfycbxon-diIi46egMwU4fGxUUm3-B9cCSMUon4i1JFvAZSgZwz8G8WshhLh7tRlrHj5maxyg/exec";

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors", // ← CORSを無視して送信のみ行う
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });

  alert("✅ お問い合わせを送信しました。ありがとうございました！");
  window.location.href = "index.html";
});

// 🔁 URLからパラメータを取得して表示に反映
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);

  const name = decodeURIComponent(params.get("name") || "");
  const email = decodeURIComponent(params.get("email") || "");
  const message = decodeURIComponent(params.get("message") || "");

  document.getElementById("confirm-name").textContent = name;
  document.getElementById("confirm-email").textContent = email;
  document.getElementById("confirm-message").textContent = message;
});
