import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.sentFriendRequests, { eager: true })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, user => user.receivedFriendRequests, { eager: true })
  @JoinColumn({ name: 'requestee_id' })
  requestee: User;

  @Column({ default: false })
  isAccepted!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  acceptedAt!: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  constructor(requester: User, requestee: User) {
    this.requestee = requestee
    this.requester = requester
  }
}
