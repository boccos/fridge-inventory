const imgs = document.querySelectorAll(".fridgeIcon");
imgs.forEach(img => {
    img.addEventListener("mouseover", () => img.src = "/images/Fridge-open.png");
    img.addEventListener("mouseout", () => img.src = "/images/Fridge.png");
});


function redir(buttonId){
    const button = document.getElementById(buttonId);
    if (button){
        button.addEventListener('click', () => window.location.href = "chat/chat.html");
    }
}

redir("chatRedir");