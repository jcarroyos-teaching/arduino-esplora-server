import React, { useEffect, useRef, useState } from 'react';

const SensorCanvas = () => {
  const [sensorData, setSensorData] = useState({ lightValue: 0, slideValue: 0, temperatureValue: 0 });
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const currentRadiiRef = useRef({ light: 0, slide: 0, temperature: 0 });

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/data');
        const data = await response.json();
        setSensorData({
          lightValue: parseInt(data.lightValue, 10),
          slideValue: parseInt(data.slideValue, 10),
          temperatureValue: parseInt(data.temperatureValue, 10),
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 500); // Fetch new data every 0.5 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  useEffect(() => {
    const animateCircles = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const { lightValue, slideValue, temperatureValue } = sensorData;
      const { light, slide, temperature } = currentRadiiRef.current;

      // Calculate target radii based on sensor values
      const targetRadii = {
        light: lightValue / 12,
        slide: slideValue / 12,
        temperature: temperatureValue * 2.8,
      };

      // Smoothly update current radii towards target radii
      currentRadiiRef.current = {
        light: light + (targetRadii.light - light) * 0.1,
        slide: slide + (targetRadii.slide - slide) * 0.1,
        temperature: temperature + (targetRadii.temperature - temperature) * 0.1,
      };

      // Clear previous drawing
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Define circles properties
      const circles = [
        { x: 100, y: 150, radius: light, color: '#F07167' },
        { x: 300, y: 150, radius: slide, color: '#00AFB9' },
        { x: 500, y: 150, radius: temperature, color: '#FED9B7' },
      ];

      // Draw each circle
      circles.forEach(({ x, y, radius, color }) => {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
      });

      // Request next frame in the animation
      animationRef.current = requestAnimationFrame(animateCircles);
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(animateCircles);

    return () => {
      // Cancel the animation on component unmount
      cancelAnimationFrame(animationRef.current);
    };
  }, [sensorData]); // We depend on `sensorData` to decide when to rerun the effect

  return (
    <canvas ref={canvasRef} width={600} height={300} />
  );
};

export default SensorCanvas;
