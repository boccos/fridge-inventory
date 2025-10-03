let selectedDifficulty = 'easy';
let strictMode = false;

document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const strictModeCheckbox = document.getElementById('strictMode');

    const fridgeIcon = document.querySelector('.headerLogo img');
    if (fridgeIcon) {
        const originalSrc = fridgeIcon.src;
        const hoverSrc = originalSrc.replace("Fridge.png", "Fridge-open.png");
        
        fridgeIcon.addEventListener("mouseover", () => fridgeIcon.src = hoverSrc);
        fridgeIcon.addEventListener("mouseout", () => fridgeIcon.src = originalSrc);
    }

    if (difficultyBtns.length > 0) {
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedDifficulty = btn.id;
                console.log('Selected difficulty:', selectedDifficulty);
            });
        });
    }

    if (strictModeCheckbox) {
        strictModeCheckbox.addEventListener('change', (e) => {
            strictMode = e.target.checked;
            console.log('Strict mode:', strictMode);
        });
    }

    async function sendMessage() {
        if (!userInput || !chatBox) return;
        
        const ingredients = userInput.value.trim();
        
        if (!ingredients) {
            alert('Please enter some ingredients!');
            return;
        }
        
        addMessage(ingredients, 'user');
        userInput.value = '';
        
        const loadingMsg = addMessage('Cooking up a recipe for you... 🍳', 'bot');
        loadingMsg.classList.add('loading');
        
        try {
            const response = await fetch('/api/recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredients,
                    difficulty: selectedDifficulty,
                    strictMode
                })
            });
            
            const data = await response.json();
            
            loadingMsg.remove();
            
            if (data.recipe) {
                addMessage(data.recipe, 'bot');
            } else {
                addMessage('Sorry, I couldn\'t generate a recipe. Please try again!', 'bot');
            }
            
        } catch (error) {
            console.error('Error:', error);
            loadingMsg.remove();
            addMessage('Oops! Something went wrong. Make sure the server is running!', 'bot');
        }
    }

    function addMessage(text, sender) {
        if (!chatBox) return null;
        
        const message = document.createElement('div');
        message.className = `message ${sender}Message`;
        message.textContent = text;
        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight;
        return message;
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});