//const API_URL = "https://script.google.com/macros/s/AKfycbymcSD-LKzCXuKJTSuCIBywQoggRNlXL--CmYTHsUPT2IcdiY5CzNtgZLUEzyz1C5ZuaQ/exec";

// 📌 URLパラメータから値を取得し、HTMLに表示
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

// 📌 「投稿」ボタンを押したときの処理
document.getElementById("submit-btn").addEventListener("click", function () {
    const params = new URLSearchParams(window.location.search);

    const title = decodeURIComponent(params.get("title") || "");
    const body = decodeURIComponent(params.get("body") || "");
    const genre = decodeURIComponent(params.get("genre") || "");
    const author = decodeURIComponent(params.get("author") || "");
    const profile = decodeURIComponent(params.get("profile") || "");

    const postData = {
        action: "post", // ✅ GASでメール送信と判断するキー
        title,
        body,
        genre,
        author,
        profile
    };

    const API_URL = "https://script.google.com/macros/s/AKfycbyOYX0NPXJrKgbWaqtf00za589wlhmDmUcGyfhgucsoWCnW6DVLU_szKu193FGjxWN_WQ/exec"; 

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
        alert("エラーが発生しました。再試行してください。");
    });
});

