const imgs = document.querySelectorAll(".fridgeIcon");

imgs.forEach(img => {
    const originalSrc = img.src;
    const hoverSrc = originalSrc.replace("Fridge.png", "Fridge-open.png");

    img.addEventListener("mouseover", () => img.src = hoverSrc);
    img.addEventListener("mouseout", () => img.src = originalSrc);
});



function redir(buttonId){
    const button = document.getElementById(buttonId);
    if (button){
        button.addEventListener('click', () => window.location.href = "/chat/chat.html");
    }
}

redir("chatRedir");