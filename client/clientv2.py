import socket
import json
import logging
import subprocess
import time
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class DiscoveryClient:
    def __init__(self, name=None, server_address="shuttle.lousienlund.de", server_port=12345):
        """
        Initialize the discovery client.
        
        Args:
            name (str): Name to identify this client. Defaults to the computer's hostname.
            server_address (str): The address of the discovery server (default: shuttle.lousienlund.de).
            server_port (int): The port of the discovery server (default: 12345).
        """
        self.name = name or socket.gethostname()
        self.server_address = server_address
        self.server_port = server_port

        logging.debug(f"Initializing DiscoveryClient with name={self.name}, server={self.server_address}, port={self.server_port}")

        # Create UDP socket
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
        logging.debug("UDP socket created.")
        
        # Enable reuse address/port options
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        logging.debug("Socket options set: SO_REUSEADDR enabled.")

    def send_availability_message(self):
        """
        Send a message to the server indicating that the client is available.
        """
        availability_message = json.dumps({'status': 'AVAILABLE', 'name': self.name})
        logging.info(f"Sending availability message to {self.server_address}:{self.server_port}")
        self.socket.sendto(availability_message.encode(), (self.server_address, self.server_port))
        logging.debug(f"Availability message sent: {availability_message}")

    def listen_for_commands(self):
        """
        Listen for incoming commands from the server and execute them.
        """
        logging.info("Listening for commands from server...")
        try:
            while True:
                data, addr = self.socket.recvfrom(1024)
                logging.debug(f"Received data: {data} from address: {addr}")
                print(data.decode())
                try:
                    command = json.loads(data.decode())
                except:
                    logging.warning("Invalid JSON format received.")
                    continue
                if command.get("command"):
                    logging.info(f"Command received: {command['command']}")
                    self.execute_command(command['command'])
                else:
                    logging.warning("Invalid command format received.")
        except Exception as e:
            logging.error(f"Error occurred while listening for commands: {str(e)}")
        finally:
            self.socket.close()

    def execute_command(self, command):
        """
        Execute a command received from the server.
        """
        try:
            logging.debug(f"Executing command: {command}")
            result = subprocess.run(command, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                logging.info(f"Command executed successfully: {result.stdout}")
            else:
                logging.error(f"Error executing command: {result.stderr}")
        except Exception as e:
            logging.error(f"Error occurred while executing command: {str(e)}")

    def start(self):
        """
        Start the client by sending an availability message and then listening for commands.
        """
        self.send_availability_message()
        self.listen_for_commands()

# Example usage
if __name__ == "__main__":
    client = DiscoveryClient(server_address="127.0.0.1", server_port=12345)
    try:
        logging.info("Starting discovery client...")
        client.start()
    except KeyboardInterrupt:
        logging.info("KeyboardInterrupt received. Stopping client...")
        client.socket.close()
