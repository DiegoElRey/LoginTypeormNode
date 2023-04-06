import { Request, Response, NextFunction } from "express";
import { User } from '../entity/User'
import { AppDataSource } from "../data-source"
import * as jwt from 'jsonwebtoken'
import config from "../config/config";

export const checkRole = (roles:Array<string>) => {
    return async (req:Request, res:Response, next: NextFunction) =>{
        const {userId} = res.locals.jwtPayload;
        console.log(userId);
        const userRepository = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {id:userId}});
        } catch (error) {
            return res.status(401).json({message: ''});
        }
        console.log(user)
        const {role} = user;
        if (roles.includes(role)) {
            next();
        }else{
            res.status(401).json({message: 'Not authorized'})
        }
    }
}