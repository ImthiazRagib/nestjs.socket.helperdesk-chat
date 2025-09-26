import { Table, Column, Model, PrimaryKey, Default, DataType, HasMany } from 'sequelize-typescript';
import { ChatMessage } from 'src/chat/entity/chat-message.entity';
import { Users } from 'src/users/entity/users.entity';

@Table
export class Room extends Model<Room> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({ type: DataType.STRING() })
    name: string;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
    })
    isActive: boolean;

    @HasMany(() => ChatMessage)
    messages: ChatMessage[];

    @HasMany(() => Users)
    users: Users[];
}
