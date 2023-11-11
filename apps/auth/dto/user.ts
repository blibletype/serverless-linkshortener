export interface UserDto {
  id: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
}

export type CreateUserDto = Omit<UserDto, 'id'>;
export type ResponceUserDto = Omit<UserDto, 'email' | 'password'>;