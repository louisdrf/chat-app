import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
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

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'created_by' })
    createdBy!: User;

    @Column({ default: false })
    isPrivate: boolean; 

    constructor(roomName: string, createdAt: Date, createdBy: User, isPrivate: boolean = false) {
        this.roomName = roomName;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.isPrivate = isPrivate;
    }
}
