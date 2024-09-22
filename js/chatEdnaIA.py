'''
Fecha: 19/07/2024
Proposito: Se realizo las modificaciones correspondientes del codigo en el que muestra el prototipo semi-funcional de EdnaIA junto con su frontend
Autores: Clarita A. Zolorza Choque & Ramiro S. Gaspar

Instalacion de librerias y del sistema:

- Windows 11: pip install rivescript
- Windows 11: pip install flask
- Windows 11: pip install flask-cors
- VsCode: Se tiene que ir a las extensiones y desde ahi se puede instalar la extension de rivescript para realizar los datos
de entrenamiento


Nota 1: Flask es un framework ligero para crear aplicaciones web en Python. 
Es muy popular por su simplicidad y flexibilidad, lo que permite construir aplicaciones web de forma rápida y con una configuración mínima. 
Flask te ayuda a manejar solicitudes HTTP, renderizar plantillas,etc.

Modificaciones: 
PASO 1: Primero, se actualizo y modifico el código en Python para que se ejecute como una API que pueda recibir solicitudes POST, procesar las entradas usando RiveScript, y devolver las respuestas.
PASO 2: Asegurar de que el archivo "ejemplo.rive" esté en el mismo directorio que el script Flask (chatEdnaIA.py) o proporcionar la ruta correcta al archivo.
PASO 3: El código JavaScript debe enviar una solicitud POST al endpoint /chat del servidor Flask. Asegurar de que este código esté configurado correctamente (scriptChat.js).
PASO 4: Ejecutar el servidor Flask, abre una terminal y navega al directorio donde está chatEdnaIA.py, ejecutar lo siguiente: "python chatEdnaIA.py".
PASO 5: Abre la interfaz del chat en el navegador y prueba enviar un mensaje. Deberías recibir una respuesta del chatbot en lugar de un mensaje de error.
'''
from flask import Flask, request, jsonify
from flask_cors import CORS
from rivescript import RiveScript

app = Flask(__name__)
CORS(app)

# Inicializa RiveScript
bot = RiveScript()
bot.load_file('ejemplo.rive')
bot.sort_replies()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    # Obtener la respuesta del bot
    reply = bot.reply("localuser", user_message)
    
    return jsonify({'response': reply})

if __name__ == "__main__":
    app.run(debug=True)
