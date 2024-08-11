import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { User } from './user';
import { Room } from './room';
import { Message } from './message';

@Entity()
export class UserRoom {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, user => user.userRooms)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Room, room => room.userRooms)
  @JoinColumn({ name: 'room_id' })
  room: Room


  @ManyToMany(() => Message)
  @JoinTable({
    name: 'unread_messages',
    joinColumn: {
      name: 'user_room_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'message_id',
      referencedColumnName: 'id'
    }
  })
  unreadMessages: Message[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastVisitedAt: Date


  constructor(user: User, room: Room, lastVisitedAt: Date, unreadMessages : Message[]) {
    this.user = user
    this.room = room
    this.lastVisitedAt = lastVisitedAt
    this.unreadMessages = unreadMessages
  }
}
