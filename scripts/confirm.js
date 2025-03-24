document.getElementById("submit-btn").addEventListener("click", function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbz0Fc2ONa88CQoppzypkXN53r4z6SwudBVbBBQDebmDmpafBcewUmvt5n5nzZxcVqs8YQ/exec";  // ← 差し替えてね！

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})  // 空のデータを送信
    })
    .then(response => response.json())
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
        alert("送信エラーが発生しました");
    });
});
