'''
Fecha: 10/06/2024
Proposito: Este codigo es la muestra de el prototipo semi-funcional de EdnaIA
Autor: Ramiro S. Gaspar

Notas: Este codigo utilza un lenguaje de programacion de codigo abierto por detras, ese sistema permite hacer un archivo
de entrenamiento con una charla para que un algoritmo de rivescript se pueda entrenar, no es la forma mas ideal de usar
a rivescript, pero se hizo por temas de practicidad. Este prototipo tiene varios errores y como no es la version final
no tiene todos la informacion que va a tener a futuro.

Instalacion de librerias y del sistema:

- Windows 11: pip install rivescript
- VsCode: Se tiene que ir a las extensiones y desde ahi se puede instalar la extension de rivescript para realizar los datos
de entrenamiento


Notas: RiveScript es un lenguaje y una biblioteca de software diseñada para la creación de chatbots y sistemas de inteligencia
conversacional. Permite a los desarrolladores definir reglas y respuestas para interactuar con usuarios de manera estructurada
y natural.

Notas2: Este codigo funciona con otro archivo, en mi caso se llama ejemplo.rive; pero si se paso una carperta donde estaba
el contenido lo mas seguro es que si este con ese mismo nombre. En cualquier caso hay que buscar el .rive
'''

#se insertan las librerias
from rivescript import RiveScript
import time
import sys

#se conecta con el algoritmo de rivescript
bot = RiveScript()

#se sacan los datos de el archivo creado para que pueda sacar las respuestas
bot.load_file('ejemplo.rive')

bot.sort_replies()

def efecto_escritura(text):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(0.03)
    print()


while True:
    msg = input('TU:> ')
    if msg == '/quit':
        quit()
 
#tiempo de espera      
    print("cargando...")
    time.sleep(2)
    reply = bot.reply("localuser", msg)
    
    print('EdnaIA_prototipo> ', end='')
    efecto_escritura(reply)