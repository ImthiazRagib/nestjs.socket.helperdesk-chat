import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatMessage } from './chat/entity/chat-message.entity';
import { UsersModule } from './users/users.module';
import { Room } from './rooms/entity/rooms.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'yourpassword',
      database: 'chat_db',
      autoLoadModels: true,
      synchronize: true, // ✅ auto create tables in dev
      models: [
        ChatMessage,
        Room
      ]
    }),
    ChatModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule { }
