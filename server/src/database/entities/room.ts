import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user';
import { Message } from './message';

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    roomName: string;

    @OneToMany(() => Message, message => message.room)
    messages!: Message[];

    @ManyToMany(() => User, user => user.rooms)
    @JoinTable()
    users!: User[];

    @Column()
    createdAt: Date;

    constructor(roomName: string, createdAt : Date) {
        this.roomName = roomName
        this.createdAt = createdAt
    }
}
