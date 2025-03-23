const API_URL = "https://script.google.com/macros/s/AKfycbymcSD-LKzCXuKJTSuCIBywQoggRNlXL--CmYTHsUPT2IcdiY5CzNtgZLUEzyz1C5ZuaQ/exec";

// ページ読み込み時にローカルストレージからデータを表示
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const title = params.get("title") || "";
    const body = params.get("body") || "";
    const genre = params.get("genre") || "";
    const author = params.get("author") || "";
    const profile = params.get("profile") || "";

    // 表示用要素にセット（表示部分のIDはそれぞれのHTMLと一致させてね）
    document.getElementById("confirm-title").innerText = title;
    document.getElementById("confirm-body").innerText = body;
    document.getElementById("confirm-genre").innerText = genre;
    document.getElementById("confirm-author").innerText = author;
    document.getElementById("confirm-profile").innerText = profile;

    // 投稿ボタン押下時に送信する用にグローバル変数として保持しておいてもOK
    window.postData = { title, body, genre, author, profile };
});


// 投稿ボタンが押されたときの処理
document.getElementById("submit-btn").addEventListener("click", function () {
    const title = decodeURIComponent(new URLSearchParams(window.location.search).get("title"));
    const body = decodeURIComponent(new URLSearchParams(window.location.search).get("body"));
    const genre = decodeURIComponent(new URLSearchParams(window.location.search).get("genre"));
    const author = decodeURIComponent(new URLSearchParams(window.location.search).get("author"));
    const profile = decodeURIComponent(new URLSearchParams(window.location.search).get("profile"));

    const postData = {
        action: "post", // ✅ GAS 側でメール送信と判断させるためのフラグ
        title,
        body,
        genre,
        author,
        profile
    };

//    const API_URL = "【あなたのGASのWebアプリURL】"; // ★ココは実際のURLに差し替えてね！

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("投稿が完了しました！メールが送信されました。");
            window.location.href = "index.html";
        } else {
            alert("投稿に失敗しました：" + data.error);
        }
    })
    .catch(error => {
        console.error("❌ 投稿エラー:", error);
        alert("エラーが発生しました。しばらくしてから再試行してください。");
    });
});

