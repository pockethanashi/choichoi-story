document.getElementById("submit-btn").addEventListener("click", function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbykUw1ZjKKTNyAd3_v0AG5ovIfL7dtpo7jG7GuAN3BFZ33mh6q6rrmfhq8I5MBLILpNvQ/exec";

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})  // 今はテスト用に空データを送信
    })
    .then(response => {
        // CORS ブロックなどで response.ok が false の場合、強制エラー
        if (!response.ok) {
            throw new Error("HTTPエラー: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("✅ メールが送信されました！");
            window.location.href = "index.html";
        } else {
            alert("❌ メール送信に失敗しました：" + data.error);
        }
    })
    .catch(error => {
        console.error("❌ 投稿エラー:", error);
        alert("送信エラーが発生しました。開発者にお問い合わせください。");
    });
});
