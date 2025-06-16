// File: chat.js

document.addEventListener('DOMContentLoaded', () => {
    const chatIcon = document.getElementById('chat-icon');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle chat widget visibility
    chatIcon.addEventListener('click', () => {
        chatWidget.classList.toggle('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatWidget.classList.add('hidden');
    });

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Display user's message
        addMessage(userMessage, 'user');
        chatInput.value = '';

        // Display thinking indicator
        addMessage('...', 'bot thinking');

        try {
            // Send message to the Netlify Function
            const response = await fetch('/.netlify/functions/openai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Remove thinking indicator and display bot's reply
            document.querySelector('.message.thinking').remove();
            addMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error fetching chat response:', error);
            document.querySelector('.message.thinking').remove();
            addMessage("Sorry, I'm having trouble connecting. Please try again later.", 'bot');
        }
    });

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initial greeting
    setTimeout(() => {
       addMessage("Hi there! I'm Sayan's AI assistant. Feel free to ask me anything about his skills and projects.", "bot");
    }, 1000);
});