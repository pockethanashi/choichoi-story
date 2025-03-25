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

//    fetch(API_URL, {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json"
//        },
//        body: JSON.stringify(postData)
//    })
    
    
    fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    })    
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ 投稿が完了しました。メールも送信されました！");
            window.location.href = "index.html";
        } else {
            alert("❌ 投稿に失敗しました：" + data.error);
        }
    })
    .catch(error => {
        console.error("❌ 投稿エラー:", error);
        alert("エラーが発生しました。再試行してください。");
    });
});
