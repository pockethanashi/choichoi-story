document.getElementById("submit-btn").addEventListener("click", function () {
    // 📌 表示されている内容を取得（textContent でOK）
    const title = document.getElementById("confirm-title").textContent;
    const body = document.getElementById("confirm-body").textContent;
    const genre = document.getElementById("confirm-genre").textContent;
    const author = document.getElementById("confirm-author").textContent;
    const profile = document.getElementById("confirm-profile").textContent;

    const postData = {
        action: "post",
        title,
        body,
        genre,
        author,
        profile
    };

    const API_URL = "https://script.google.com/macros/s/AKfycbysCRNFuZgtzBmhz3UQPa9TA5GoSRW5qJGXC4-I6xS7GgooO4jm-RDvNjqmytTb49a4hw/exec";

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
