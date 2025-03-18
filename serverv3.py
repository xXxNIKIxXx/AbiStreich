import socket
import threading
import time

# List to keep track of connected clients
clients = {}

def handle_client_connection(client_socket, client_address, client_id):
    clients[client_id] = client_socket
    print(f"[Server] {client_id} has connected from {client_address}")

    while True:
        # Receive heartbeat message or other data from the client
        message = client_socket.recv(1024).decode('utf-8').strip()
        
        if message == "HEARTBEAT":
            print(f"[Server] Heartbeat received from {client_id}")
            continue  # Just continue on receiving heartbeat
        
        if not message:
            break
        
        print(f"[Server] Received message from {client_id}: {message}")

    print(f"[Server] {client_id} has disconnected.")
    del clients[client_id]  # Remove from the client list when disconnected
    client_socket.close()

def start_server(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))
    server_socket.listen(5)
    print(f"[Server] Listening on {host}:{port}...")

    while True:
        client_socket, client_address = server_socket.accept()
        client_id = f"Client_{client_address[1]}"  # Unique identifier based on client's IP and port

        # Start a thread to handle the client connection
        client_handler = threading.Thread(target=handle_client_connection, args=(client_socket, client_address, client_id))
        client_handler.daemon = True
        client_handler.start()

def display_active_clients():
    while True:
        time.sleep(10)  # Update every 10 seconds
        if not clients:
            print("[Server] No clients connected.")
        else:
            print("\n[Server] Active clients:")
            for idx, client_id in enumerate(clients.keys(), 1):
                print(f"{idx}. {client_id}")
        print("-" * 30)

def send_commands_to_client():
    while True:
        # Display active clients
        display_active_clients()
        
        # Ask user to select a client to send commands
        try:
            selected_client_idx = int(input("\n[Server] Choose client by number: ")) - 1
            selected_client_id = list(clients.keys())[selected_client_idx]
            client_socket = clients[selected_client_id]

            command = input(f"\n[Server] Enter command for {selected_client_id}: ").strip()
            client_socket.send(command.encode('utf-8'))

            # Receive and print the output from the selected client
            response = client_socket.recv(4096).decode('utf-8')
            print(f"Client response: {response}")
        except (ValueError, IndexError):
            print("[Server] Invalid selection. Try again.")

if __name__ == "__main__":
    # Start the server to listen on a specific IP and port
    threading.Thread(target=start_server, args=("0.0.0.0", 5001), daemon=True).start()
    
    # Start the client display and command loop
    send_commands_to_client()
