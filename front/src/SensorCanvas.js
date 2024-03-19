import React, { useEffect, useRef, useState, useMemo } from "react";

// Mover hexToRgba fuera del componente ya que no depende del estado ni props
const hexToRgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

const SensorCanvas = () => {
  const [sensorData, setSensorData] = useState({
    "Accel X,Y,Z": [0, 0, 0],
    "Buttons Up,Down,Left,Right": [0, 0, 0, 0],
    "Joystick X,Y,Button": [0, 0, 0],
    "Light,Temperature,Slider,Microphone": [0, 0, 0, 0],
  });
  const canvasRef = useRef(null);
  const currentRadiiRef = useRef({});

  const colors = useMemo(() => [
    "#000000", "#0047AB", "#CA1F7B", "#32CD32",
    "#CA1F7B", "#B22222", "#007A7A", "#4169E1",
  ].map(color => hexToRgba(color, 0.7)), []);

  useEffect(() => {
    const fetchData = async () => {
      // La lógica de carga de datos sigue igual
      try {
        const response = await fetch("http://localhost:3000/api/data");
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const animateCircles = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      let circleIndex = 0;

      Object.keys(sensorData).forEach((key) => {
        sensorData[key].forEach((value, valueIndex) => {
          const flatIndex = circleIndex + valueIndex;
          drawCircleAndText(context, key, value, flatIndex, currentRadiiRef.current, colors);
        });
        circleIndex += sensorData[key].length;
      });

      requestAnimationFrame(animateCircles);
    };

    animateCircles();
    return () => cancelAnimationFrame(animateCircles);
  }, [sensorData, colors]); // Agregar colors a las dependencias

  // Aumentar el tamaño del canvas para manejar más datos visualmente
  return <canvas ref={canvasRef} width={1600} height={600} />;
};

// Función separada para dibujar círculos y texto
const drawCircleAndText = (context, key, value, index, radiiRef, colors) => {
  const currentRadius = radiiRef[index] || 0;
  let targetRadius = calculateTargetRadius(key, value);
  radiiRef[index] = currentRadius + (targetRadius - currentRadius) * 0.1;

  const colorIndex = index % colors.length;
  context.beginPath();
  context.arc(100 + index * 100, 300, radiiRef[index], 0, 2 * Math.PI);
  context.fillStyle = colors[colorIndex];
  context.fill();

  // Agregar texto
  context.fillStyle = '#000';
  const textYPos = index % 2 === 0 ? 300 - radiiRef[index] - 20 : 300 + radiiRef[index] + 20;
  context.fillText(`${key} ${value}`, 100 + index * 100, textYPos);
};

// Función separada para calcular el radio objetivo
const calculateTargetRadius = (key, value) => {
  if (key === 'Button' || key === 'Joystick') {
    return value === '1' ? 30 : 10;
  } else {
    let radius = Math.abs(parseInt(value, 10) / 6);
    return Math.max(radius, 5); // Asegurar un radio mínimo de 5px
  }
};

export default SensorCanvas;
