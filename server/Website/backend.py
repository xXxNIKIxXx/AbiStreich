from flask import Blueprint, render_template, request, redirect, url_for
import socket
import json

from util.send_command import send_command

backend = Blueprint('backend', __name__)

# Global list to store scanned boards
scanned_boards = []

@backend.route('/', methods=['GET'])
def schedule_update():
    return redirect(url_for('backend.boards'))

@backend.route("/boards")
def boards():
    return render_template("boards.html", boards=scanned_boards)

@backend.route("/get_boards")
def get_boards():
    global scanned_boards  # Declare the global variable
    # Broadcast UDP message to all clients
    broadcast_address = '<broadcast>'
    port = 12345
    message = "DISCOVER_CLIENTS"
    timeout = 5

    # Create UDP socket
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    udp_socket.settimeout(timeout)

    try:
        # Send broadcast message
        udp_socket.sendto(message.encode(), (broadcast_address, port))

        # Collect responses
        scanned_boards = []  # Reset the list before updating
        while True:
            try:
                data, addr = udp_socket.recvfrom(1024)
                client_info = json.loads(data.decode())
                scanned_boards.append({'name': client_info['name'], 'ip': addr[0]})
            except socket.timeout:
                break

        return render_template("boards.html", boards=scanned_boards)
    except Exception as e:
        return {"error": str(e)}
    finally:
        udp_socket.close()

@backend.route("/board/<name>", methods=['GET', 'POST'])
def board(name):
    global scanned_boards  # Access the global variable
    board = next((b for b in scanned_boards if b['name'] == name), None)
    if request.method == 'GET':
        if board:
            return render_template("board.html", board=board)
        else:
            return {"error": "Board not found"}, 404
    else:
        send_command(request.form.get('content'), request.form.get('ip'))
        return render_template("board.html", board=board)