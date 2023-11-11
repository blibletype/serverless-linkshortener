import { BadRequestException } from "./api-error";

const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const validateAuthBody = (body: any) => {
  const { email, password } = body;

  if (!email || !password) {
    throw new BadRequestException();
  }

  if (typeof email !== 'string') {
    throw new BadRequestException();
  }

  if (typeof password !== 'string') {
    throw new BadRequestException();
  }

  if (password.length < 8) {
    throw new BadRequestException();
  }

  if (!emailRegExp.test(email)) {
    throw new BadRequestException();
  }
}