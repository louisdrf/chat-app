import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Token } from "./token";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  pseudo: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToOne(() => Token, token => token.user)
  @JoinColumn()
  token: Token

    constructor(pseudo: string, email: string, password: string, token : Token) {
        this.pseudo = pseudo
        this.email = email
        this.password = password
        this.token = token
    }
}
