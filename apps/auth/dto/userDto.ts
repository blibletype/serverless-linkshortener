export interface UserDto {
  id: string;
  email: string;
  password: string;
  refreshToken: string;
}

export interface CreateUserDto extends UserDto {}
