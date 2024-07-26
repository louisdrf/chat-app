import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


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

    constructor(pseudo: string, email: string, password: string) {
        this.pseudo = pseudo
        this.email = email
        this.password = password
    }
}
