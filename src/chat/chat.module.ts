import { Module } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatMessage } from './entity/chat-message.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([ChatMessage]), RoomsModule, UsersModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService]
})
export class ChatModule { }
