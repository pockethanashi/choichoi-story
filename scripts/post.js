const API_URL = "https://script.google.com/macros/s/AKfycbzSinrW5dN8okhGTDqF_W8Ld01xvd4AxTvrRE-1NJPzMgJ-Kyh7p_c7Sia844C9SGgegQ/exec";


document.getElementById("post-form").addEventListener("submit", function(event) {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();
    const genre = document.getElementById("genre").value;
    const author = document.getElementById("author").value.trim();
    const profile = document.getElementById("profile").value.trim();

    if (!title || !body || !author) {
        alert("タイトル、本文、作者名は必須です。");
        return;
    }

    const postData = { title, body, genre, author, profile };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("投稿が完了しました！");
            window.location.href = "index.html"; // 投稿完了後にトップページへリダイレクト
        } else {
            alert("投稿に失敗しました。エラー: " + data.error);
        }
    })
    .catch(error => {
        console.error("❌ 投稿エラー:", error);
        alert("エラーが発生しました。再試行してください。");
    });
});













