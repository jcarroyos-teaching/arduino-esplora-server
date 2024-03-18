from flask import Flask, jsonify
import serial
from threading import Thread
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

serial_port = serial.Serial('/dev/tty.usbmodem14101', baudrate=9600, timeout=1)

latest_data = {}

def parse_data(data):
    sections = data.split(' | ')
    parsed_data = {}
    for section in sections:
        key_values = section.split(': ')
        key = key_values[0]
        values = key_values[1].split(',')
        parsed_data[key] = values
    return parsed_data

def read_from_port(ser):
    global latest_data
    while True:
        try:
            serial_data = ser.readline().decode('utf-8').strip()
            if serial_data:
                print(f"Raw data from serial port: {serial_data}")
                latest_data = parse_data(serial_data)
                print(f"Received data from serial port: {latest_data}")
        except serial.SerialException:
            print("Error reading from serial port")
            break
        time.sleep(0.5)

thread = Thread(target=read_from_port, args=(serial_port,))
thread.start()

@app.route('/api/data', methods=['GET'])
def get_data():
    if not latest_data:
        return jsonify({"error": "Data not available yet"}), 503
    return jsonify(latest_data)

if __name__ == '__main__':
    app.run(port=3000, debug=True)
