function redir(buttonId){
    const button = document.getElementById(buttonId);
    if (button){
        button.addEventListener('click', () => window.location.href = "../chat/chat.html");
    }
}

redir("chatRedir");