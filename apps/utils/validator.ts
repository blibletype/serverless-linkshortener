import { BadRequestException } from "./api-error";

const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const validateAuthBody = (body: any) => {
  const { email, password } = body;

  if (!email || !password)
    throw new BadRequestException();

  if (typeof email !== 'string')
    throw new BadRequestException();

  if (typeof password !== 'string')
    throw new BadRequestException();

  if (password.length < 8)
    throw new BadRequestException();

  if (!emailRegExp.test(email))
    throw new BadRequestException();
}

export const validateLinkBody = (body: any) => {
  const { originLink, expiresIn } = body;

  if (!originLink)
    throw new BadRequestException();

  if (!/^(https?):\/\/[^\s\/$.?#].[^\s]*$/.test(originLink))
    throw new BadRequestException();

  if (expiresIn) {
    if (!/^[1|3|7]d$/.test(expiresIn))
      throw new BadRequestException();
  }
}