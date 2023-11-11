import { AuthController } from "./controller/auth.controller";

const authController = new AuthController();

export const signUp = (event: any) => authController.signUp(event);

export const signIn = (event: any) => authController.singIn(event);