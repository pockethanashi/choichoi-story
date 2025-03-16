const API_URL = "https://script.google.com/macros/s/AKfycbzKUrcNdNsF_-Z1lFnDD9ggZXTROw1oPby0sTyR283ENjnmPYaePaOrIYOyjjn0fuOvTw/exec";

document.getElementById("post-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const author = document.getElementById("author").value.trim();
    const profile = document.getElementById("profile").value.trim();

    if (!title || !body || !genre || !author) {
        alert("タイトル・本文・ジャンル・作者名は必須です！");
        return;
    }

    const postData = {
        title: title,
        body: body,
        genre: genre,
        author: author,
        profile: profile
    };

    fetch(API_URL, {  // ✅ ここで `API_URL` を適用
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ 投稿が完了しました！");
            window.location.href = "index.html"; // 投稿後にトップページへリダイレクト
        } else {
            console.error("❌ 投稿エラー:", data.error);
            alert("投稿に失敗しました：" + data.error);
        }
    })
    .catch(error => {
        console.error("❌ 投稿エラー:", error);
        alert("投稿中にエラーが発生しました。");
    });
});
