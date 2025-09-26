// chat/entities/chat-message.entity.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Room } from 'src/rooms/entity/rooms.entity';
import { Users } from 'src/users/entity/users.entity';

@Table({ tableName: 'chat_messages', timestamps: true, paranoid: true })
export class ChatMessage extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    message: string;

    @ForeignKey(() => Room)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    roomId: number; // 💬 New: room name

    @BelongsTo(() => Room)
    room: Room;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @BelongsTo(() => Users)
    user: Users;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
    })
    images?: string[];

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
    })
    documents?: string[];
}
