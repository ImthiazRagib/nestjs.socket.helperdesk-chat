import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatMessage } from './chat/entity/chat-message.entity';
import { UsersModule } from './users/users.module';
import { Room } from './rooms/entity/rooms.entity';
import { ConfigModule } from '@nestjs/config';
import { Users } from './users/entity/users.entity';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true, // 👈 makes it available everywhere
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: process.env.NODE_ENV === 'dev',
      synchronize: process.env.NODE_ENV === 'dev', // ✅ auto create tables in dev
      models: [
        ChatMessage,
        Room,
        Users
      ]
    }),
    ChatModule,
    UsersModule,
    RoomsModule
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule { }
