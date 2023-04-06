import { Entity, Unique, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, Column } from "typeorm"
import {MinLength, IsNotEmpty, IsEmail} from 'class-validator';
import * as bcrypt from 'bcryptjs'
@Entity()
@Unique(['username'])

export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @MinLength(6)
    username: string

    @Column()
    @MinLength(6)
    password: string

    @Column()
    @IsNotEmpty()
    role: string

    @Column()
    @CreateDateColumn()
    CreatedAt: Date

    @Column()
    @UpdateDateColumn()
    UpdateAt: Date

    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

}
