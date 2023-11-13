import { AuthController } from "./controller/auth.controller";

const authController = new AuthController();

export const signUp = async (event: any) =>  authController.signUp(event);

export const signIn = async (event: any) => authController.singIn(event);