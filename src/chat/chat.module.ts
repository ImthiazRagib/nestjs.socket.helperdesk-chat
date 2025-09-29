import { Module } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatMessage } from './entity/chat-message.entity';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [SequelizeModule.forFeature([ChatMessage]), RoomsModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService]
})
export class ChatModule {}
