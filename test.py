import json
import socket
import struct

# Define multicast address and port
multicast_group = '224.0.0.1'  # Multicast address for local network-wide communication
port = 12345
message = "DISCOVER_CLIENTS"
timeout = 5

# Create UDP socket
udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
udp_socket.settimeout(timeout)

# Set up the multicast group for receiving messages
group = socket.inet_aton(multicast_group)
mreq = struct.pack('4sL', group, socket.INADDR_ANY)

# Bind the socket to listen to the multicast group
udp_socket.bind(("", port))
udp_socket.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

try:
    # Send multicast message
    udp_socket.sendto(message.encode(), (multicast_group, port))

    # Collect responses
    scanned_boards = []  # Reset the list before updating
    while True:
        try:
            data, addr = udp_socket.recvfrom(1024)
            client_info = json.loads(data.decode())
            scanned_boards.append({'name': client_info['name'], 'ip': addr[0]})
        except socket.timeout:
            break
        
    print(scanned_boards)
except Exception as e:
    print({"error": str(e)})
finally:
    udp_socket.close()
