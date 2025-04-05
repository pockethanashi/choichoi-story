const CONTACT_API = "https://script.google.com/macros/s/AKfycbxon-diIi46egMwU4fGxUUm3-B9cCSMUon4i1JFvAZSgZwz8G8WshhLh7tRlrHj5maxyg/exec";

// contact.js
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contact-submit").addEventListener("click", function () {
    const name = encodeURIComponent(document.getElementById("name").value.trim());
    const email = encodeURIComponent(document.getElementById("email").value.trim());
    const message = encodeURIComponent(document.getElementById("message").value.trim());

    if (!message) {
      alert("お問い合わせ内容は必須です。");
      return;
    }

    const url = `confirm-contact.html?name=${name}&email=${email}&message=${message}`;
    window.location.href = url;
  });
});
