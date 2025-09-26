import { Table, Column, Model, PrimaryKey, Default, DataType, HasMany, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { ChatMessage } from 'src/chat/entity/chat-message.entity';
import { Room } from 'src/rooms/entity/rooms.entity';

@Table
export class Users extends Model<Users> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING(), unique: true })
  userName: string;

  @Column({ type: DataType.STRING() })
  password: string;

  @Column({
    type: DataType.STRING(),
    unique: true,
    validate: {
      isEmail: true
    }
  })
  email: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @HasMany(() => ChatMessage)
  messages: ChatMessage[];

  @BelongsTo(() => Room)
  rooms: Room[];
}
