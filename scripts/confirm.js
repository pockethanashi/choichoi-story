//const API_URL = "https://script.google.com/macros/s/AKfycbymcSD-LKzCXuKJTSuCIBywQoggRNlXL--CmYTHsUPT2IcdiY5CzNtgZLUEzyz1C5ZuaQ/exec";

document.getElementById("submit-btn").addEventListener("click", function () {
    const title = document.getElementById("confirm-title").textContent;

    const postData = {
        title: title
    };

    const API_URL = "https://script.google.com/macros/s/AKfycbzXyq2NxtCtISMjJq--8rNS2NbKMnBo14tLm5oew52swp4VqzqRlHxZz6ZeMtL_16MmIw/exec";

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
            alert("投稿失敗: " + data.error);
        }
    })
    .catch(error => {
        console.error("❌ 投稿エラー:", error);
        alert("通信エラーが発生しました。");
    });
});

