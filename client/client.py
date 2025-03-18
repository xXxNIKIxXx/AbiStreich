import socket
import json
import logging
import subprocess  # Import subprocess for running PowerShell commands
import os 

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class DiscoveryClient:
    def __init__(self, name=None, port=12345):
        """
        Initialize the discovery client.
        
        Args:
            name (str): Name to identify this client. Defaults to the computer's hostname.
            port (int): Port to listen on for discovery requests.
        """
        # Use the computer's hostname if no name is provided
        self.name = socket.gethostname()
        self.port = port
        
        logging.debug(f"Initializing DiscoveryClient with name={self.name}, port={self.port}")
        
        # Create UDP socket
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        logging.debug("UDP socket created.")
        
        # Enable reuse address/port options
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        logging.debug("Socket options set: SO_REUSEADDR enabled.")
        
        # Bind to the specified port
        self.socket.bind(("", self.port))
        logging.debug(f"Socket bound to port {self.port}.")
    
    def start_listening(self):
        """
        Start listening for discovery requests.
        """
        logging.info("Starting to listen for discovery requests...")
        try:
            while True:
                # Receive data from the socket
                logging.debug("Waiting to receive data...")
                data, addr = self.socket.recvfrom(1024)
                logging.debug(f"Received data: {data} from address: {addr}")
                print(data.decode())
                
                # Check if it's a discovery request
                if data.decode() == "DISCOVER_CLIENTS":
                    logging.info(f"Discovery request received from {addr}.")
                    
                    # Send response back to the sender
                    response = {
                        'name': self.name,
                        'ip': addr[0]
                    }
                    logging.debug(f"Sending response: {response} to {addr}")
                    self.socket.sendto(json.dumps(response).encode(), addr)
                
                # Check if it's a command to execute
                elif data.decode().startswith("EXECUTE_COMMAND:"):
                    command = data.decode().split("EXECUTE_COMMAND:")[1].strip()
                    logging.info(f"Command received: {command} from {addr}")
                    
                    # Start a new PowerShell process and execute the command
                    try:
                        logging.debug(f"Executing PowerShell command: {command}")
                        subprocess.run(["powershell", "-Command", command], check=True)
                        logging.info("Command executed successfully.")
                    except subprocess.CalledProcessError as e:
                        logging.error(f"Error executing command: {str(e)}")
        
        except Exception as e:
            logging.error(f"Error occurred: {str(e)}")
        finally:
            logging.info("Closing socket.")
            self.socket.close()
    
    def stop(self):
        """
        Stop the client.
        """
        logging.info("Stopping the client.")
        self.socket.close()

# Example usage
if __name__ == "__main__":
    # Create a client named "MyDevice"
    client = DiscoveryClient(port=12345)
    
    try:
        logging.info("Starting discovery client...")
        client.start_listening()
    except KeyboardInterrupt:
        logging.info("KeyboardInterrupt received. Stopping client...")
        client.stop()