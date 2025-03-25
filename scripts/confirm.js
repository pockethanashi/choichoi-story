document.getElementById("submit-btn").addEventListener("click", function () {
    const title = document.getElementById("confirm-title").textContent;
    const body = document.getElementById("confirm-body").innerText;
    const genre = document.getElementById("confirm-genre").textContent;
    const author = document.getElementById("confirm-author").textContent;
    const profile = document.getElementById("confirm-profile").innerText;

    const postData = {
        title,
        body,
        genre,
        author,
        profile
    };

    const API_URL = "https://script.google.com/macros/s/AKfycbykUw1ZjKKTNyAd3_v0AG5ovIfL7dtpo7jG7GuAN3BFZ33mh6q6rrmfhq8I5MBLILpNvQ/exec";
    
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // ← CORS制限があるのでレスポンスは受け取れない
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData) // ← titleだけじゃなく全データ送信
    });

    // レスポンスが読めないため、送信直後に遷移させる
    alert("✅ 投稿処理が完了しました（メール送信されているはずです）");
    window.location.href = "index.html";
});