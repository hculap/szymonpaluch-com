document.addEventListener("DOMContentLoaded", function() {
    sessionStorage.clear();
    // Add dynamic styles
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .chat-bubble {
            z-index: 99999999;
        }
        .chat-window {
            z-index: 99999999;
            width: 400px;
            height: 500px;
        }
        .card-header {
            background-color: #7a94ce;
            color: #fff;
        }
        .chat-body {
            max-height: 400px;
            overflow-y: auto;
        }
        .message-time {
            font-size: 12px;
            color: #555;
        }
        .message-right {
            text-align: right;
        }
        .message-left {
            text-align: left;
            background-color: rgba(39, 40, 42, 0.03);
        }
        .typing-indicator {
            background-color: #eee;
            animation: typingFlash 1s infinite;
        }
        @keyframes typingFlash {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        @media (max-width: 768px) {
            .chat-window {
                width: 100vw;
                height: 50vh;
                position: fixed;
            }
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    // Inject chat HTML into the DOM
    document.getElementById('chat-container').innerHTML = `
        <!-- Chat -->
        <div id="chat-bubble" class="chat-bubble shadow-lg position-fixed bottom-0 end-0 m-3">
            <button class="btn btn-primary rounded-0 text-uppercase ">?</button>
        </div>
        <div id="chat-window" class="chat-window shadow-lg position-fixed bottom-0 end-0 m-0 m-lg-3" style="display:none;">
        <div class="card ">
            <div class="card-header fw-bold rounded-0">
            Twój Asystent
            <button id="close-btn" class="btn-close float-end"></button>
            </div>
            <div class="card-body chat-body c-light-1 ">
            <!-- Messages will be added here -->
            </div>
            <div class="card-footer">
            <div class="input-group">
                <input id="input-box" class="form-control rounded-0 bg-light-1" type="text" placeholder="Zadaj mi pytanie..." >
                <div class="input-group-append">
                <button id="send-btn" class="btn btn-primary rounded-0 text-uppercase "  type="button">Wyślij</button>
                </div>
            </div>
            </div>
        </div>
        </div>
    `;
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeButton = document.getElementById('close-btn');
    const sendButton = document.getElementById('send-btn');
    const inputBox = document.getElementById('input-box');
    const productId = document.getElementById('chat-container').dataset.productId;


    chatBubble.addEventListener('click', function() {
        chatWindow.style.display = 'flex';
        chatBubble.style.display = 'none';
        chatWindow.style.flexDirection = 'column';
    });

    closeButton.addEventListener('click', function() {
        chatWindow.style.display = 'none';
        chatBubble.style.display = 'block';
    });

    const appendMessageToChat = (messageText, alignmentClass) => {
        const chatBody = document.querySelector('.chat-body');
        const newMessageDiv = document.createElement('div');
        const messageTime = new Date().toLocaleTimeString('pl-PL', { hour12: false, hour: '2-digit', minute: '2-digit' });

    
        newMessageDiv.className = `message p-2 ${alignmentClass}`;
        newMessageDiv.innerHTML = `
            <span>${messageText}</span>
            <div class="message-time">${messageTime}</div>
        `;
        
        chatBody.appendChild(newMessageDiv);
    };

    firstMessage = 'Cześć! Czy mogę Ci pomóc uzyskać informacje dotyczące kursu "Inteligentna Fabryka Pomysłów"?';
    appendMessageToChat(firstMessage,  'message-left');
    

    const showTypingIndicator = () => {
        const chatBody = document.querySelector('.chat-body');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message typing-indicator p-2';
        typingDiv.innerText = '...';
        typingDiv.id = 'typing-indicator';
        chatBody.appendChild(typingDiv);

        // Scroll the chat window to show the newest message
        chatBody.scrollTop = chatBody.scrollHeight;
    };

        const removeTypingIndicator = () => {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    };

    // Function to send message
    const sendMessage = () => {
    const message = inputBox.value.trim();
    const previousMessage = sessionStorage.getItem("previousMessage") || "";
    const previousAnswer = sessionStorage.getItem("previousAnswer") || "";
    if (message) {
        appendMessageToChat(message, 'message-right');  // Append user's message to chat
        inputBox.value = '';

        // Save the current message to sessionStorage
        sessionStorage.setItem("previousMessage", message);

        // Show typing indicator
        showTypingIndicator();

        // Send the message to the API
        fetch('https://hook.eu1.make.com/was6inuosx3lehyfavsp9p4p89afs2bj', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: message, 
                previousMessage: previousMessage, 
                previousAnswer: previousAnswer,
                productId: productId
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator
            removeTypingIndicator();

            if (data.message) {
            // Append response message to chat
            appendMessageToChat(data.message, 'message-left'); 
            // Save the assistant's answer to sessionStorage
            sessionStorage.setItem("previousAnswer", data.message);
            }
        })
        .catch(error => {
            console.log('Error sending message:', error);
            // Remove typing indicator
            removeTypingIndicator();
            // Append response message to chats
            appendMessageToChat("Upss! Coś poszło nie tak. Spróbuj wysłać widomość ponownie.", 'message-left'); 
        });
    }
    }

    // Event Listener for Send Button
    sendButton.addEventListener('click', sendMessage);

    // Event Listener for Enter Key in the Input Box
    inputBox.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 && !event.shiftKey) { // 13 is the keyCode for Enter
        event.preventDefault(); // Prevent a new line being added in the input box
        sendMessage();
    }
    });
});