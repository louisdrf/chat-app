import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Token } from "./token";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToOne(() => Token, token => token.user)
  @JoinColumn()
  token: Token

    constructor(username: string, email: string, password: string, token : Token) {
        this.username = username
        this.email = email
        this.password = password
        this.token = token
    }
}
