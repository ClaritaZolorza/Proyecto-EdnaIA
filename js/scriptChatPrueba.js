// Selecciona el elemento con el id 'chat-input' es la caja de texto donde el usuario escribe los mensajes.
const chatInput = document.querySelector('#chat-input');
// Selecciona el botón con el id 'send-btn', se usa para enviar el mensaje una vez que se hace clic en él.
const sendButton = document.querySelector('#send-btn');
// Selecciona el contenedor con la clase 'chat-container', donde se mostrarán los mensajes enviados por el usuario y las respuestas del chatbot.
const chatContainer = document.querySelector(".chat-container");
// Selecciona el botón con el id 'theme-btn', cambia el tema de la interfaz (de claro a oscuro).
const themeButton = document.querySelector("#theme-btn");
// Selecciona el botón con el id 'delete-btn' se usa para borrar los mensajes en el chat.
const deleteButton = document.querySelector("#delete-btn");

// Inicializa una variable 'userText' que luego almacenará el texto ingresado por el usuario.
// Actualmente está en 'null' porque no hay texto definido hasta que el usuario escriba algo.
let userText = null;

// Define la URL de la API donde se enviarán las solicitudes HTTP para interactuar con el servidor.
const API_URL = "http://127.0.0.1:5000/chat"; // URL de servidor Flask (Explicación de conexion de servidor en el archivo chatEdnaIA.py)
// Guarda la altura inicial del área de texto donde el usuario escribe los mensajes.
const initialHeight = chatInput.scrollHeight;

// Función que carga datos desde el 'localStorage' del navegador para inicializar la interfaz del chat.
const loadDataFromLocalstorage = () => {
    // Recupera la preferencia del tema almacenada en el 'localStorage' bajo la clave 'theme-color'.
    const themeColor = localStorage.getItem("theme-color");

    // Cambia el tema según lo guardado en el localStorage
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    // Texto por defecto que se mostrará si no hay ningún chat almacenado en el 'localStorage'.
    const defaultText = `<div class="default-text">
                            <h1>EdnaIA</h1>
                            <p>Inicie una conversación y explore el poder de la IA.<br> Su historial de chat se mostrará aquí.</p>
                        </div>`;

    // Cargar chats desde el localStorage o mostrar el texto por defecto si está vacío
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;

    // Asegura que el contenedor del chat se desplace hacia abajo hasta la última conversación (en caso de que haya un historial de chat o se haya acumulado).
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}
// Carga la configuración y los datos del chat almacenados previamente al iniciar la aplicación.
loadDataFromLocalstorage();

const createElement = (html, className) => {
    // Crea un nuevo elemento 'div' para contener el mensaje del chat.
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
/**
 * Función asíncrona que envía el mensaje del usuario al servidor y recibe la respuesta del chatbot.
 * @param {HTMLElement} incomingChatDiv - El div que representa el mensaje entrante, donde se mostrará la respuesta.
 */
const getChatResponse = async (incomingChatDiv) => {
     // Crea un nuevo elemento <p> que contendrá la respuesta del chatbot.
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",  // El método de la solicitud es POST
        headers: {
            "Content-Type": "application/json" // El contenido es de tipo JSON.
        },
        body: JSON.stringify({
            message: userText // El mensaje que el usuario ingresó en el chat se envía en el cuerpo de la solicitud.
        })
    };
        try {
             // Realiza una solicitud al servidor Flask utilizando la API fetch.
            const response = await fetch(API_URL, requestOptions);
            if (!response.ok) throw new Error('Network response was not ok');
            // Convierte la respuesta del servidor a formato JSON.
            const data = await response.json();
            // Llama a la función typeText para simular el efecto de escritura y mostrar la respuesta del chatbot.
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

// Función que muestra la animación de escritura del chatbot.
const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                    
                        <img src="./img/logo2.png" alt="chatgpt-img">
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

// Función que maneja el envío de mensajes del usuario (chat saliente).
const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra space | Obtenga el valor chatInput y elimine el espacio extra
    if(!userText) return; // If chatInput is empty return from here | Si chatInput está vacío, regrese desde aquí
    
    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;
    // Estructura HTML del mensaje del usuario. (foto-perfil y mensaje)
    const html = `<div class="chat-content">
                    <div class="chat-details">  
                        <!--CAMBIAR IMG DE USUARIO-->
                        <img src="./img/PerfilUser.png" alt="user-img">

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

// Función para eliminar todos los mensajes del historial y restaurar el estado inicial
const deleteChatHistory = () => {
    // Texto por defecto que se mostrará después de eliminar los mensajes
    const defaultText = `<div class="default-text">
                            <h1>EdnaIA</h1>
                            <p>Inicie una conversación y explore el poder de la IA.<br> Su historial de chat se mostrará aquí.</p>
                        </div>`;
    // Establece el contenido del contenedor de chat con el texto por defecto
    chatContainer.innerHTML = defaultText;
    // Guarda el estado actual del historial vacío con el texto por defecto en el localStorage
    localStorage.setItem("all-chats", chatContainer.innerHTML);
};

// Escucha el evento click en el botón de eliminar mensajes
deleteButton.addEventListener("click", deleteChatHistory);

// Evento para cambiar el tema de la página.
themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage
    // Cambie la clase del cuerpo para el modo de tema y guarde el tema actualizado en el almacenamiento local
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});


chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    // Ajuste la altura del campo de entrada dinámicamente según su contenido
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
// // Detectar cuando se presiona una tecla en el campo de entrada
chatInput.addEventListener("keydown", (e) => {
    // Si se presiona la tecla Enter sin Shift y el ancho de la ventana es mayor / If the Enter key is pressed without Shift and the window width is larger
    // de 800 píxeles, maneja el chat saliente / than 800 pixels, handle the outgoing chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault(); // Prevent form submission on Enter key press | Evite el envío del formulario al presionar la tecla Enter
        handleOutgoingChat();
    }
});
// Detectar cuando se hace clic en el botón de enviar y manejar el chat saliente
sendButton.addEventListener("click", handleOutgoingChat);
