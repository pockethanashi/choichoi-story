const API_URL = "https://script.google.com/macros/s/AKfycbzs3eTsfF7uFUN31Ag5sf71vR_ZIAN2b9JWvKaxp9byHbJLnQHumzPktrnvUZml9WAWRw/exec";

// URLパラメータを取得して内容を画面に表示
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const title = params.get("title");
    const body = params.get("body");
    const genre = params.get("genre");
    const author = params.get("author");
    const profile = params.get("profile");

    document.getElementById("confirm-title").innerText = title;
    document.getElementById("confirm-body").innerText = body;
    document.getElementById("confirm-genre").innerText = genre;
    document.getElementById("confirm-author").innerText = author;
    document.getElementById("confirm-profile").innerText = profile;

    // 投稿ボタンにイベントを設定
    document.getElementById("submit-btn").addEventListener("click", () => {
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
                alert("投稿が完了しました！");
                window.location.href = "index.html";
            } else {
                alert("投稿に失敗しました。エラー: " + data.error);
            }
        })
        .catch(error => {
            console.error("❌ 投稿エラー:", error);
            alert("投稿エラーが発生しました。再試行してください。");
        });
    });
});
