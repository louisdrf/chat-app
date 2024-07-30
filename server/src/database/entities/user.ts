import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { Token } from "./token";
import { Message } from "./message";
import { Room } from "./room";
import { Friendship } from "./friendship";
import { v4 as uuidv4 } from 'uuid';

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

  @Column({ unique: true })
  uid: string

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
      this.uid = this.generateUID()
  }

  private generateUID(): string {
    return uuidv4().slice(0, 8) // 8 caractères
  }
}
