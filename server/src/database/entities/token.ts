import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token: string;

    @OneToOne(() => User, user => user.token)
    user: User;

    constructor(token: string, user: User) {
        this.token = token
        this.user = user
    }
}