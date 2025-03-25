document.getElementById("submit-btn").addEventListener("click", function () {
    const title = document.getElementById("confirm-title").textContent;
    const body = document.getElementById("confirm-body").innerText;
    const genre = document.getElementById("confirm-genre").textContent;
    const author = document.getElementById("confirm-author").textContent;
    const profile = document.getElementById("confirm-profile").innerText;

    const postData = {
        action: "post",
        title,
        body,
        genre,
        author,
        profile
    };

    const API_URL = "https://script.google.com/macros/s/AKfycbyFIJpJDc5teoaYIiDBA9T9KIKjSyOV5wvbEUwMYSKUkGXTk0O9AiJjw1eUMF0KXS3J_w/exec";
    
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // ← CORS制限があるのでレスポンスは受け取れない
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData) // ← titleだけじゃなく全データ送信
    });

    // レスポンスが読めないため、送信直後に遷移させる
    alert("✅ 投稿処理が完了しました");
    window.location.href = "index.html";
});



// ✅ URLパラメータから値を取得して表示
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const title = decodeURIComponent(params.get("title") || "");
    const body = decodeURIComponent(params.get("body") || "");
    const genre = decodeURIComponent(params.get("genre") || "");
    const author = decodeURIComponent(params.get("author") || "");
    const profile = decodeURIComponent(params.get("profile") || "");

    // 表示用エレメントに反映
    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-body").innerHTML = body.replace(/\n/g, "<br>");
    document.getElementById("confirm-genre").textContent = genre;
    document.getElementById("confirm-author").textContent = author;
    document.getElementById("confirm-profile").innerHTML = profile.replace(/\n/g, "<br>");
});

