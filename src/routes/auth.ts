import { Router } from "express";
import AuthController from "../controller/AuthController";
import { checkJwt } from "../middlewares/jwt";
const router = Router();

router.use('/login', AuthController.login);

router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;

