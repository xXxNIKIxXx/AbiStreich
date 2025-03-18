import socket
import json
import logging

def send_command(command, ip, port=12345):
    """
    Send a command to a specific IP address.

    Args:
        command (str): The command to send.
        ip (str): The target IP address.
        port (int): The target port (default is 12345).

    Returns:
        dict: The response from the server, if any.
    """
    logging.debug(f"Preparing to send command: {command} to IP: {ip} on port: {port}")
    
    try:
        # Create a UDP socket
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            # Send the command to the target IP and port
            message = f"EXECUTE_COMMAND:{command}"
            logging.debug(f"Sending message: {message}")
            sock.sendto(message.encode(), (ip, port))
            
            # Wait for a response (optional, depending on your use case)
            sock.settimeout(5)  # Set a timeout for the response
            try:
                response, _ = sock.recvfrom(1024)
                logging.debug(f"Received response: {response}")
                return json.loads(response.decode())
            except socket.timeout:
                logging.warning("No response received from the server.")
                return None
    except Exception as e:
        logging.error(f"Error occurred while sending command: {str(e)}")
        return None