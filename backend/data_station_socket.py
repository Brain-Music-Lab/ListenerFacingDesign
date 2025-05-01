import asyncio
import websockets
import sys
import json
from interactions import \
                        initialize_hardware, \
                        turn_light_off, \
                        turn_light_on, \
                        process_button_input, \
                        process_joystick_input

# Keep track of connected clients
connected_clients = set()

async def broadcast_message(message):
    """Send a message to all connected clients."""
    disconnected_clients = set()
    for client in connected_clients:
        try:
            await client.send(message.lower())
        except websockets.exceptions.ConnectionClosed:
            disconnected_clients.add(client)
    
    # Clean up disconnected clients
    for client in disconnected_clients:
        connected_clients.remove(client)
        print(f"Client disconnected. Remaining clients: {len(connected_clients)}")

async def handle_input(joystick, buttons):
    """Handle console input and broadcast to all clients."""
    print("Reading")
    while True:
        # Detect joystick input
        joystick, stick_out = process_joystick_input(joystick)
        if stick_out:
            await broadcast_message(json.dumps(stick_out))

        # Detect button input
        buttons, button_out = process_button_input(buttons)
        if button_out:
            await broadcast_message(json.dumps(button_out))

async def handle_client(websocket):
    """Handle individual client connections."""
    try:
        connected_clients.add(websocket)
        print(f"Client connected. Total clients: {len(connected_clients)}")
        
        # Send initial connection confirmation
        await websocket.send(json.dumps({"status": "connected"}))
        
        # Keep connection alive and handle messages
        async for message in websocket:
            try:
                # Echo back any received messages to confirm connection is alive
                await websocket.send(message)
            except Exception as e:
                print(f"Error handling message: {e}")
                break
                
    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected. Remaining clients: {len(connected_clients) - 1}")
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        print("Connection cleaned up")

async def main():
    """Main server function that starts both the WebSocket server and input handler."""
    server = await websockets.serve(
        handle_client, 
        "localhost", 
        8765,
        ping_interval=20,  # Send ping every 20 seconds
        ping_timeout=60    # Wait 60 seconds for pong response
    )
    print("WebSocket server started on ws://localhost:8765")
    
    joystick, buttons = initialize_hardware()
    # Create tasks for handling input and the server
    input_task = asyncio.create_task(handle_input(joystick, buttons))
    server_task = asyncio.create_task(server.serve_forever())
    
    try:
        # Wait for either task to complete
        done, pending = await asyncio.wait(
            [input_task, server_task],
            return_when=asyncio.FIRST_COMPLETED
        )
        
        # Cancel remaining tasks
        for task in pending:
            task.cancel()
            
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        server.close()
        await server.wait_closed()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    sys.exit(0)