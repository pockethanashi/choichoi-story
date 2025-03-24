//const API_URL = "https://script.google.com/macros/s/AKfycbymcSD-LKzCXuKJTSuCIBywQoggRNlXL--CmYTHsUPT2IcdiY5CzNtgZLUEzyz1C5ZuaQ/exec";

// 📌 URLパラメータから値を取得して表示
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const title = params.get("title") || "";
    const body = params.get("body") || "";
    const genre = params.get("genre") || "";
    const author = params.get("author") || "";
    const profile = params.get("profile") || "";

    // 表示用エレメントに反映
    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-body").innerHTML = body.replace(/\n/g, "<br>");
    document.getElementById("confirm-genre").textContent = genre;
    document.getElementById("confirm-author").textContent = author;
    document.getElementById("confirm-profile").innerHTML = profile.replace(/\n/g, "<br>");
});

// 📌 「投稿」ボタンを押したときの処理
document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submit-btn");

    if (submitBtn) {
        submitBtn.addEventListener("click", function () {
            const params = new URLSearchParams(window.location.search);

            const postData = {
                action: "post",
                title: params.get("title") || "",
                body: params.get("body") || "",
                genre: params.get("genre") || "",
                author: params.get("author") || "",
                profile: params.get("profile") || ""
            };

            const API_URL = "https://script.google.com/macros/s/AKfycbyxr2SovS9NYyn5vAE6JiP5MMS6I626MyGgt57FLBBxZCRmq4ZAD4Bt6GX4hFnGa50R4A/exec";

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
    }
});
