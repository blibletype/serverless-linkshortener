import { AuthController } from "./controller/auth.controller";

const authController = new AuthController();

export const signUp = async (event: any) =>  authController.signUp(event);

export const signIn = async (event: any) => authController.singIn(event);

export const hello = async (event: any, context: any) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, context })
  }
}