function sendMessage() {
    var userInput = document.getElementById("user-input");
    var message = userInput.value;
    if (message.trim() === "") return;
    var chatBox = document.getElementById("chat-box");
    var newMessage = document.createElement("div");
    newMessage.textContent = message;
    newMessage.classList.add("message");
    chatBox.appendChild(newMessage);
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }