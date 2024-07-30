import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Room } from './room';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    content: string;

    @Column()
    sentAt: Date;

    @Column()
    modifiedAt!: Date;

    @Column({ default : false })
    isPinned!: boolean

    @ManyToOne(() => User, user => user.messages, { eager: true })
    @JoinColumn({ name: 'sent_by' })
    sentBy: User;

    @ManyToOne(() => Room, room => room.messages)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    constructor(content: string, sentAt: Date, sentBy: User, room: Room) {
        this.content = content;
        this.sentAt = sentAt;
        this.sentBy = sentBy;
        this.room = room;
        this.modifiedAt = sentAt
    }
}
