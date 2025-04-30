import asyncio
import websockets
import aioconsole
import sys

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

async def handle_input():
    """Handle console input and broadcast to all clients."""
    print("Enter direction (up/down/left/right), color (green/red/blue/yellow) or 'q' to quit:")
    while True:
        message = await aioconsole.ainput()
        if message.lower() in ['up', 'down', 'left', 'right', 'green', 'red', 'blue', 'yellow']:
            await broadcast_message(message.lower())
        elif message.lower() == 'q':
            break
        else:
            print("Invalid input. Please enter up, down, left, right, color (green/red/blue/yellow), or q to quit")

async def handle_client(websocket):
    """Handle individual client connections."""
    try:
        connected_clients.add(websocket)
        print(f"Client connected. Total clients: {len(connected_clients)}")
        
        # Keep the connection alive until it's closed
        await websocket.wait_closed()
        
    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected. Remaining clients: {len(connected_clients) - 1}")
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        print("Connection cleaned up")

async def main():
    """Main server function that starts both the WebSocket server and input handler."""
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")
    
    # Create tasks for handling input and the server
    input_task = asyncio.create_task(handle_input())
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