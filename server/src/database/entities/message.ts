import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content: string;

  @Column()
  sentAt: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sent_by' })
  sentBy: User;  

  constructor(content: string, sentAt: Date, sentBy: User) {
    this.content = content;
    this.sentAt = sentAt;
    this.sentBy = sentBy;
  }
}
