# Backend Python Flask App

Este código es un servidor Flask que lee datos de un puerto serie, desde un dispositivo Arduino Esplora, y proporciona estos datos a través de una API REST.

Primero, se importan las bibliotecas necesarias. Flask es un marco de trabajo para crear aplicaciones web, jsonify es una función para convertir objetos Python en una respuesta HTTP JSON. serial es una biblioteca para la comunicación serie, Thread es una clase para la creación de hilos y time es una biblioteca para operaciones relacionadas con el tiempo. CORS es una extensión de Flask para manejar el recurso compartido de origen cruzado.

Se crea una instancia de la aplicación Flask y se habilita CORS para esta aplicación. Luego, se establece una conexión con el puerto serie y se define una variable global latest_data para almacenar los últimos datos leídos del puerto serie.

La función read_from_port se ejecuta en un hilo separado y lee continuamente del puerto serie. Los datos leídos se decodifican de bytes a una cadena de texto y se almacenan en latest_data. Si ocurre una excepción al leer del puerto serie, se imprime un mensaje de error y se rompe el bucle.

La ruta /api/data está configurada para manejar las solicitudes GET. Si latest_data no contiene al menos dos comas, se devuelve un error. De lo contrario, los datos se dividen en tres partes: lightValue, temperatureValue y slideValue, y se devuelven como una respuesta JSON.

Finalmente, si este script se ejecuta como el programa principal, se inicia la aplicación Flask en el puerto 3000 con el modo de depuración activado.

# Front Javascript React App

Esta app define un componente de React llamado SensorCanvas. Este componente utiliza varias características de React, incluyendo hooks como useState, useEffect y useRef.

El hook useState se utiliza para crear un estado local en el componente para almacenar los datos del sensor. Los datos del sensor incluyen valores de luz, deslizamiento y temperatura.

El hook useRef se utiliza para crear referencias a ciertos objetos que queremos persistir a lo largo de las renderizaciones del componente. En este caso, se crean referencias para el canvas, la animación y los radios actuales de los círculos que se van a dibujar en el canvas.

El primer hook useEffect se utiliza para obtener datos del sensor de un servidor. Dentro de este hook, se define una función asíncrona fetchData que realiza una solicitud HTTP al servidor para obtener los datos del sensor. Estos datos se almacenan en el estado del componente utilizando setSensorData. La función fetchData se ejecuta inmediatamente y luego se ejecuta cada 0.5 segundos utilizando setInterval. Cuando el componente se desmonta, se limpia el intervalo para evitar efectos secundarios no deseados.

El segundo hook useEffect se utiliza para animar círculos en el canvas basándose en los datos del sensor. Dentro de este hook, se define una función animateCircles que realiza varias operaciones para dibujar y animar círculos en el canvas. Esta función se ejecuta cada vez que se solicita un nuevo cuadro de animación utilizando requestAnimationFrame. Cuando el componente se desmonta, se cancela la animación para evitar efectos secundarios no deseados.

Finalmente, el componente devuelve un elemento canvas que se renderiza en el DOM. Este canvas tiene una referencia adjunta a él para que pueda ser accedido dentro de las funciones fetchData y animateCircles.
