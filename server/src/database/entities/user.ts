import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { Token } from "./token";
import { Message } from "./message";
import { Room } from "./room";
import { Friendship } from "./friendship";
import { UserRoom } from "./userRoom";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ default : false })
  isOnline! : boolean

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  uid: string

  @Column({ default : null })
  socketId!: string

  @OneToOne(() => Token, token => token.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  token: Token

  @OneToMany(() => Message, message => message.sentBy, { onDelete: 'CASCADE' })
  messages!: Message[]
  
  @ManyToMany(() => Room, room => room.users)
  rooms!: Room[]

  @OneToMany(() => Friendship, friendship => friendship.requester, { onDelete: 'CASCADE' })
  sentFriendRequests!: Friendship[]

  @OneToMany(() => Friendship, friendship => friendship.requestee, { onDelete: 'CASCADE' })
  receivedFriendRequests!: Friendship[]

  @OneToMany(() => UserRoom, userRoom => userRoom.user)
  userRooms!: UserRoom[]

  @ManyToOne(() => Room, room => room.currentUsers)
  currentRoom!: Room 

  constructor(username: string, email: string, password: string, token : Token, uid: string) {
      this.username = username
      this.email = email
      this.password = password
      this.token = token
      this.uid = uid
  }

}
