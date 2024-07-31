import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Room } from './room';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    sentAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;

    @Column({ default : false })
    isPinned!: boolean

    @ManyToOne(() => User, user => user.messages, { eager: true })
    @JoinColumn({ name: 'sent_by' })
    sentBy: User;

    @ManyToOne(() => Room, room => room.messages, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'room_id' })
    room: Room;

    constructor(content: string, sentAt: Date, sentBy: User, room: Room) {
        const now = new Date();
        now.setMilliseconds(0);

        this.content = content;
        this.sentAt = now;
        this.modifiedAt = now
        this.sentBy = sentBy;
        this.room = room;
    }
}
