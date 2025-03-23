// URLパラメータから投稿データを取得して表示
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    document.getElementById("confirm-title").innerText = params.get("title") || "未入力";
    document.getElementById("confirm-body").innerText = params.get("body") || "未入力";
    document.getElementById("confirm-genre").innerText = params.get("genre") || "未入力";
    document.getElementById("confirm-author").innerText = params.get("author") || "未入力";
    document.getElementById("confirm-profile").innerText = params.get("profile") || "未入力";

    // 投稿ボタンが押されたとき
    document.getElementById("submit-post").addEventListener("click", () => {
        const postData = {
            action: "post",
            title: params.get("title"),
            body: params.get("body"),
            genre: params.get("genre"),
            author: params.get("author"),
            profile: params.get("profile")
        };

        const API_URL = "https://script.google.com/macros/s/AKfycbzs3eTsfF7uFUN31Ag5sf71vR_ZIAN2b9JWvKaxp9byHbJLnQHumzPktrnvUZml9WAWRw/exec";

        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("投稿が完了しました！");
                window.location.href = "index.html";
            } else {
                alert("投稿失敗: " + data.error);
            }
        })
        .catch(error => {
            console.error("❌ 投稿エラー:", error);
            alert("エラーが発生しました。");
        });
    });
});
