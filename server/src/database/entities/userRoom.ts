import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Room } from './room';

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

  @Column({ default: 0 })
  unreadMessagesCount: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastVisitedAt: Date


  constructor(user: User, room: Room, unreadMessagesCount: number, lastVisitedAt: Date) {
    this.unreadMessagesCount = unreadMessagesCount
    this.user = user
    this.room = room
    this.lastVisitedAt = lastVisitedAt
  }
}
