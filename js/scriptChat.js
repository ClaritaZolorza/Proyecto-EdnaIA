const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
// Put your key this const API_KEY = "YOUR_KEY_HERE" | Pon tu clave esta const API_KEY = "YOUR_KEY_HERE"
const API_KEY = key();
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>EdnaIA</h1>
                            <!--Start a conversation and explore the power of AI.<br> Your chat history will be display here.-->
                            <p>Inicie una conversación y explore el poder de la IA.<br> Su historial de chat se mostrará aquí.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

const createElement = (html, className) => {
    //Create new div and apply chat, specified class and set html content of div
    //Cree un nuevo div y aplique el chat, la clase especificada y establezca el contenido html del div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; // Return the created chat div | Devuelve el div de chat creado
}

//Obtener respuesta de chat
const getChatResponse = async (incomingChatDiv) => {
    //const API_URL ="https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");


// Define the properties and data for the API request
// Definir las propiedades y los datos para la solicitud de API
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model:"gpt-3.5-turbo-instruct",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    // Send POST request to API, get response and set the response as  paragraph element text
    // Envíe una solicitud POST a la API, obtenga una respuesta y establezca la respuesta como texto de elemento de párrafo
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        //console.log(response);
        pElement.textContent = response.choices[0].text.trim();
    } catch(error) {
        //console.log(error); Oops! Something went wrong while retrieving the response. Please try again.
        pElement.classList.add("error");
        pElement.textContent = "¡Ups! Algo salió mal al recuperar la respuesta. Inténtalo de nuevo."
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    // Elimine la animación de escritura, agregue el elemento de párrafo y guarde los chats en el almacenamiento local
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats,", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    // Copia el contenido del texto de la respuesta al portapapeles
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(()=> copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                    
                        <img src="./img/Logo2.png" alt="user-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;


    // Create an incoming chat div with typing animation and append it to chat container
    //Creación de un div de chat entrante con animación de escritura y agregarlo al contenedor de chat
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra space | Obtenga el valor chatInput y elimine el espacio extra
    if(!userText) return; // If chatInput is empty return from here | Si chatInput está vacío, regrese desde aquí
    
    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = `<div class="chat-content">
                <div class="chat-details">  
                    <!--CAMBIAR IMG DE USUARIO-->
                     <img src="./img/Logo2.png" alt="user-img">

                    <p></p>
                </div>
            </div>`;


    // Create an outgoing chat div with user's message and append it to chat container        
    //Cree un div de chat saliente con el mensaje del usuario y agréguelo al contenedor de chat
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".defaul-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage
    // Cambie la clase del cuerpo para el modo de tema y guarde el tema actualizado en el almacenamiento local
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    // Elimine los chats del almacenamiento local y llame a la función loadDataFromLocalstorage
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});


chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    // Ajuste la altura del campo de entrada dinámicamente según su contenido
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // Si se presiona la tecla Enter sin Shift y el ancho de la ventana es mayor / If the Enter key is pressed without Shift and the window width is larger
    // de 800 píxeles, maneja el chat saliente / than 800 pixels, handle the outgoing chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);