import { v4 } from "uuid";
import { hash } from 'bcryptjs';
import { ConflictException } from "../../utils/api-error";
import { ResponceUserDto } from "../dto/user.dto";
import { UserRepository } from "../repository/user.repository";
import { AuthService } from "./auth.service";

export class UserService {
  private userRepository = new UserRepository();
  private authService = new AuthService();

  public async create(email: string, password: string): Promise<ResponceUserDto> {
    const user = await this.userRepository.findOneByEmail(email);
    if (user) throw new ConflictException('This email already taken');

    const id = v4();
    const hashedPassword = await hash(password, 10);

    const accessToken = this.authService.signAccessToken({ id, email });
    const refreshToken = this.authService.signRefreshToken({ id, email });

    if (!accessToken || !refreshToken) throw new Error();

    await this.userRepository.create({
      id,
      email,
      password: hashedPassword,
      accessToken,
      refreshToken
    });

    return { id, accessToken, refreshToken };
  }
}