import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private users: Record<string, string> = {}

  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: RoomsService,
    private readonly userService: UsersService
  ) { }

  handleConnection(client: Socket) {
    console.log(`User connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
    delete this.users[client.id]
    this.server.emit('users', Object.values(this.users))
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    this.users[client.id] = username;
    this.server.emit('users', Object.values(this.users));
  }
  
  // 🚪 Join Room
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: number; userId: number },
  ) {
    const { roomId, userId } = payload;

    const room = await this.roomService.getRoomById(roomId);
    const user = await this.userService.getUserByIdentifier(userId);

    client.join(room.name); // Join the socket room
    client.data.user = user;
    client.data.room = room;
    
    // Fetch and send old messages
    const history = await this.chatService.getMessages(room.id);
    client.emit('roomJoined', { room: room.name, history });
    
    this.server
    .to(room.name)
    .emit('systemMessage', `${user.userName} joined the room "${room.name}"`);
  }
  
    // @SubscribeMessage('sendMessage')
    // handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { username: string; message: string }) {
    //   this.server.emit('newMessage', data); // broadcast message to all clients
    // }
  
  // @SubscribeMessage('sendMessage')
  // async handleMessage(
  //   @MessageBody() payload: { username: string; message: string },
  // ) {
  //   // ✅ Save message to DB
  //   const saved = await this.chatService.saveMessage(
  //     payload.username,
  //     payload.message,
  //   );

  //   // ✅ Emit back to all clients
  //   this.server.emit('newMessage', saved);
  // }

    // 💬 Send Message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { message: string },
  ) {
    const user = client.data.user;
    const room = client.data.room;

    if (!room) {
      client.emit('error', 'You must join a room first');
      return;
    }

    const saved = await this.chatService.saveMessage(
      user.id,
      payload.message,
      room.id,
    );

    // Emit only to that room
    this.server.to(room).emit('newMessage', saved);
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
  ) {
    const room = client.data.room;
    const roomExists = this.roomService.getRoomById(room.id)
    if (!room || !roomExists) {
      client.emit('error', 'You must join a room first');
      return;
    }
    const messages = await this.chatService.getMessages(roomExists.id);
    return messages;
  }
}
