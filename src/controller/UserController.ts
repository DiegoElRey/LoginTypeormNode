import { Request, Response } from "express"
import { User } from "../entity/User"
import { validate } from 'class-validator'
import { AppDataSource } from "../data-source"
export class UserController {

    static getAll = async (req: Request, res: Response) => {
        const userRepository = AppDataSource.getRepository(User);
        try {
            const users = await userRepository.find();
            res.send(users);
        } catch (error) {
            res.status(404).json({message: 'Not result'});
        }        
    }

    static getById = async (req: Request, res: Response) => {
        const id = req.params;
        const userRepository = AppDataSource.getRepository(User);
        try {
            const user = await userRepository.findOneByOrFail(id);
            res.send(user);
        } catch (error) {
            res.status(404).json({message: 'Not result'})
        }
    }

    static newUser = async (req: Request, res: Response) => {
        const {username, password, role} = req.body;
        const user = new User();
        user.username = username;
        user.password = password;
        user.role = role;
        
        console.log(user);
        const validateOption = {validationError: {target: false, value: false}};
        const errors = await validate(user, validateOption);
        if(errors.length > 0){
            return res.status(400).json(errors);
        }
        const userRepository = AppDataSource.getRepository(User);
        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({message: 'User already register'});
        }

        res.send('User created');
    }

    static editUser = async (req:Request, res:Response) => {
        let user;
        const id = req.params;
        const {username, role} = req.body;
        const userRepository = AppDataSource.getRepository(User);
        try {
            user = await userRepository.findOneByOrFail(id);
            user.username = username;
            user.role = role;
        } catch (error) {
            res.status(404).json({message: 'User not found'});
        }        
        const validateOption = {validationError: {target: false, value: false}};
        const errors = await validate(user, validateOption);
        if (errors.length > 0) {
            res.status(400).json(errors);
        }
        try {
            await userRepository.save(user);
        } catch (error) {
            res.status(409).json({message: 'User already in use'});
        }
        res.status(201).json({message: 'User update'});
    }

    static deleteUser = async (req:Request, res:Response) => {
        const id = req.params;
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneByOrFail(id);
        } catch (error) {
            res.status(404).json({message: 'User not found'});
        }
        userRepository.delete(id);
        res.status(201).json({message: 'User deleted'});
    }
}