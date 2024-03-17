from flask import Flask, jsonify
import serial
from threading import Thread
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Replace '/dev/tty.usbmodem14101' with the correct port for your system.
# Use "python -m serial.tools.list_ports" in your terminal to find available serial ports.
serial_port = serial.Serial('/dev/tty.usbmodem14101', baudrate=9600, timeout=1)

latest_data = "No data"

def read_from_port(ser):
    global latest_data
    while True:
        try:
            # Read the newest output from the Arduino
            serial_data = ser.readline().decode('utf-8').strip()
            if serial_data:  # If not an empty string
                print(f"Raw data from serial port: {serial_data}")  # Debug log
                latest_data = serial_data
                print(f"Received data from serial port: {latest_data}")
        except serial.SerialException:
            print("Error reading from serial port")
            break  # Optionally, attempt reconnection here
        time.sleep(0.1)  # Prevent overly aggressive CPU usage

# Start the serial reading in a separate thread
thread = Thread(target=read_from_port, args=(serial_port,))
thread.start()

@app.route('/api/data', methods=['GET'])
def get_data():
    if latest_data.count(',') < 2:
        return jsonify({'error': 'Not enough data'}), 500

    lightValue, temperatureValue, slideValue = latest_data.split(',')
    print(f"Sending data: Light: {lightValue}, Temperature: {temperatureValue}, Slide: {slideValue}")  # Log the data being sent
    return jsonify({
        'lightValue': lightValue,
        'temperatureValue': temperatureValue,
        'slideValue': slideValue
    })

if __name__ == '__main__':
    app.run(port=3000, debug=True)
