
import { Request, Response } from "express";
import {User} from "../entity/User";
import { AppDataSource } from "../data-source";
import * as jwt from 'jsonwebtoken'
import config from "../config/config";
import { validate } from "class-validator";

class AuthController{
    static login = async (req: Request, res: Response) => {
        const {username, password} = req.body;
        if (!(username && password)) {
            return res.status(400).json({message: 'Username and password are required!'});
        }
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {username: username}});
        } catch (error) {
            return res.status(404).json({message: 'username or password incorrect!'})
        }
        if (!user.checkPassword(password)) {
            return res.status(400).json({message: "username or password are incorrect"})
        }
        const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn:'1h'})
        res.json({message: 'OK', token});
    };

    static changePassword = async (req: Request, res: Response) =>{
        const {userId} = res.locals.jwtPayload;
        const {oldPassword, newPassword} = req.body;
        console.log(userId)
        if (!(oldPassword && newPassword)) {
            res.status(400).json({message: 'Old password and new passwor are required'});
        }
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id:userId}});
        } catch (error) {
            res.status(400).json({message: 'Something goes wrong!'});
        }
        console.log(user)
        if (!user.checkPassword(oldPassword)) {
            return res.status(401).json({message: 'Password old incorrect!'});
        }
        user.password = '';
        user.password = newPassword;
        const validateOption = {validationError: {target: false, value: false}};
        const errors = await validate(user,validateOption);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        user.hashPassword();
        userRepository.save(user);
        res.json({message: 'Password change!'})
    }
}

export default AuthController;