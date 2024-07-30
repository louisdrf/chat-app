import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { Token } from "./token";
import { Message } from "./message";
import { Room } from "./room";
import { Friendship } from "./friendship";


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

  @OneToMany(() => Message, message => message.sentBy)
  messages!: Message[]
  
  @ManyToMany(() => Room, room => room.users)
  rooms!: Room[]

  @OneToMany(() => Friendship, friendship => friendship.requester)
  sentFriendRequests!: Friendship[]

  @OneToMany(() => Friendship, friendship => friendship.requestee)
  receivedFriendRequests!: Friendship[]


  constructor(username: string, email: string, password: string, token : Token) {
      this.username = username
      this.email = email
      this.password = password
      this.token = token
      this.sentFriendRequests = []
      this.receivedFriendRequests = []
  }
}
