import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  content: string

  @Column()
  sentAt: Date

    constructor(content: string, sentAt : Date) {
        this.content = content
        this.sentAt = sentAt
    }
}
