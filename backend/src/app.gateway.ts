
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ namespace: '/', cors: true })  // Enable CORS for the WebSocket server
  export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket, ...args: any[]) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('events')
    handleEvent(client: Socket, data: any): void {
      this.server.emit('events', data); 
    }
  }
  