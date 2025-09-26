// chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatMessage } from '../entity/chat-message.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatMessage)
        private readonly chatMessageModel: typeof ChatMessage,
    ) { }

    // async saveMessage(username: string, message: string) {
    //     return this.chatMessageModel.create({ username, message });
    // }

    // async getMessages(limit = 20) {
    //     return this.chatMessageModel.findAll({
    //         order: [['createdAt', 'DESC']],
    //         limit,
    //         raw: true
    //     });
    // }


    async saveMessage(userId: number, message: string, roomId: number) {
    return this.chatMessageModel.create({ userId, message, roomId });
  }

  async getMessages(roomId: number, limit = 20) {
    return this.chatMessageModel.findAll({
      where: { roomId: roomId },
      order: [['createdAt', 'DESC']],
      limit,
    });
  }
}

