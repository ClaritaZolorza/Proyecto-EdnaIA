import ollama

def chat_EdmaIA():
  """
  Función principal que gestiona la interacción del chat con EdnaIA.
  Utiliza el modelo Ollama para generar respuestas basadas en el contexto de la conversación.
  """
  print("Bienvenido a EdnaIA. Para terminar el chat escribe 'salir'.")

  # Inicialización del contexto con una instrucción de sistema
  context = ["System: Eres un asistente de escritura y siempre hablas español. Tu nombre es EdnaIA."]

  while True:
    # Captura la entrada del usuario
    user_input = input("Tu: ")

    # Verifica si el usuario desea salir del chat
    if user_input.lower() == 'salir':
      print("Adios🫡")
      break

    # Agrega la entrada del usuario al contexto de la conversación
    context.append(f"Human: {user_input}")

    # Construye el prompt completo incluyendo todo el contexto acumulado
    full_prompt = "\n".join(context) + "\nEdnaIA:"

    print("EdnaIA:", end=" ", flush=True)
    response = ""

    # Genera la respuesta de EdnaIA utilizando el modelo Ollama
    # Ajustamos la temperatura a 0.3 para obtener respuestas más enfocadas
    for chunk in ollama.generate(model='gemma2:2b', prompt=full_prompt, temperature=0.3, stream=True):
      chunk_text = chunk['response']
      print(chunk_text, end="", flush=True)
      response += chunk_text
    print()  # Agrega una nueva línea después de la respuesta completa

    # Incorpora la respuesta de EdnaIA al contexto
    context.append(f"EdnaIA: {response}")

    # Limita el tamaño del contexto para evitar un crecimiento excesivo
    if len(context) > 11:  # Mantiene el contexto inicial + las últimas 5 interacciones
      context = [context[0]] + context[-10:]

# Inicia la ejecución del chat
chat_EdmaIA()
