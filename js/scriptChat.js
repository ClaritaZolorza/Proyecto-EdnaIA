const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-btn');
const newChatButton = document.querySelector('#new-chat-btn');
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const chatHistoryContainer = document.querySelector("#chat-history");
const menuToggle = document.querySelector('.menu-toggle');  
const sideNav = document.querySelector('.side-nav');        

let userText = null;
// Put your key this const API_KEY = "YOUR_KEY_HERE" | Pon tu clave esta const API_KEY = "YOUR_KEY_HERE"
//const API_KEY = key();

const API_URL = "http://127.0.0.1:5000/chat"; // URL de servidor Flask
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    // Cambia el tema según lo guardado en el localStorage
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>EdnaIA</h1>
                            <p>Inicie una conversación y explore el poder de la IA.<br> Su historial de chat se mostrará aquí.</p>
                        </div>`;

    // Cargar chats desde el localStorage o mostrar el texto por defecto si está vacío
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


// Función para simular el efecto de escritura
const typeText = (element, text) => {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.append(text.charAt(index));
            index++;
            chatContainer.scrollTo(0, chatContainer.scrollHeight);
        } else {
            clearInterval(interval);
            localStorage.setItem("all-chats", chatContainer.innerHTML);
        }
    }, 50); // Velocidad de escritura (50ms por carácter)
};




//Obtener respuesta de chat
const getChatResponse = async (incomingChatDiv) => {
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userText
        })
    };

    // try {
    //     const response = await fetch(API_URL, requestOptions);
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }

    //     const data = await response.json();
    //     const responseText = data.response.trim();
        
    //     // Usa la función de escritura gradual
       
    //     typeText(pElement, responseText, () => {
    //         localStorage.setItem("all-chats", chatContainer.innerHTML);
    //     });
        // Usa 'data.response' en lugar de 'responseText'
        // typeText(pElement, data.response.trim(), () => {
            // Código a ejecutar después de completar la escritura
        //     localStorage.setItem("all-chats", chatContainer.innerHTML);

        // });}
        try {
            const response = await fetch(API_URL, requestOptions);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            typeText(pElement, data.response.trim());
        } catch (error) {
        pElement.classList.add("error");
        pElement.textContent = "¡Ups! Algo salió mal al recuperar la respuesta. Inténtalo de nuevo.";
        console.error('Error:', error);
        }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    //localStorage.setItem("all-chats,", chatContainer.innerHTML);
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


// Función para enviar un mensaje
// const sendMessage = () => {
//     const message = chatInput.value.trim();
//     if (message !== "") {
//         // Eliminar texto por defecto si hay mensajes
//         const defaultTextElement = document.querySelector('.default-text');
//         if (defaultTextElement) {
//             defaultTextElement.remove();
//         }

//         // Agregar mensaje al chat
//         const newMessage = document.createElement('div');
//         newMessage.classList.add('chat', 'outgoing');
//         newMessage.innerHTML = `<div class="chat-content">
//                                     <div class="chat-details">
//                                         <img src="./img/Logo2.png" alt="user-img">
//                                         <p>${message}</p>
//                                     </div>
//                                 </div>`;
//         chatContainer.appendChild(newMessage);
//         chatInput.value = ""; // Limpiar input

//         // Guardar el chat en localStorage
//         saveChatsToLocalstorage();
//         chatContainer.scrollTo(0, chatContainer.scrollHeight);

//         // Simular respuesta de IA
//         setTimeout(showTypingAnimation, 500);
//     }
// }


// Función para cargar el historial de conversaciones desde localStorage
const loadChatHistory = () => {
    const chatHistory = JSON.parse(localStorage.getItem("chat-history")) || [];
    chatHistoryContainer.innerHTML = "";

    chatHistory.forEach((chat, index) => {
        const chatItem = document.createElement("p");
        chatItem.textContent = `Chat ${index + 1}`;
        chatItem.addEventListener("click", () => loadChatFromHistory(index));
        chatHistoryContainer.appendChild(chatItem);
    });
};

const saveChatToHistory = (chatContent) => {
    const chatHistory = JSON.parse(localStorage.getItem("chat-history")) || [];
    chatHistory.push(chatContent);
    localStorage.setItem("chat-history", JSON.stringify(chatHistory));
    loadChatHistory();
};

// Función para cargar un chat específico desde el historial
const loadChatFromHistory = (index) => {
    const chatHistory = JSON.parse(localStorage.getItem("chat-history")) || [];
    if (chatHistory[index]) {
        chatContainer.innerHTML = chatHistory[index];
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }
};




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
    //Eliminar el texto por defecto si existe
    const defaultTextElement = document.querySelector(".default-text");
    if (defaultTextElement){
        defaultTextElement.remove();
    }
    
    //document.querySelector(".defaul-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);

    saveChatToHistory(chatContainer.innerHTML);
  
};

// Nueva función para crear un nuevo chat
const createNewChat = () => {
    const chatContent = chatContainer.innerHTML;
    if (!chatContent.includes("default-text") && chatContent.trim()) {
        saveChatToHistory(chatContent);
    }

    chatContainer.innerHTML = `<div class="default-text">
                                <h1>EdnaIA</h1>
                                <p>Inicie una conversación y explore el poder de la IA.<br> Su historial de chat se mostrará aquí.</p>
                               </div>`;
    loadChatHistory();
};

// Cargar el historial de conversaciones al cargar la página
document.addEventListener("DOMContentLoaded", loadChatHistory);

// Manejar el menú lateral
document.addEventListener('DOMContentLoaded', function() {
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (sideNav) {
                sideNav.classList.toggle('show');
            }
        });
    }

    // Alternar la visibilidad de la barra lateral
    document.querySelector('.toggle-sidebar').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

});

newChatButton.addEventListener("click", createNewChat);

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage
    // Cambie la clase del cuerpo para el modo de tema y guarde el tema actualizado en el almacenamiento local
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

// Modificar la función para eliminar el historial de conversaciones
deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        localStorage.removeItem("chat-history");
        loadDataFromLocalstorage();
        loadChatHistory();
    }
});



// deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    // Elimine los chats del almacenamiento local y llame a la función loadDataFromLocalstorage
//     if(confirm("Are you sure you want to delete all the chats?")) {
//         localStorage.removeItem("all-chats");
//         loadDataFromLocalstorage();
//     }
// });


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
        e.preventDefault(); // Prevent form submission on Enter key press | Evite el envío del formulario al presionar la tecla Enter
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);
