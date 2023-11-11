import { v4 } from "uuid";
import { hash, compare } from 'bcryptjs';
import { ConflictException, NotFoundException, UnauthorizedException } from "../../utils/api-error";
import { UserRepository } from "../repository/user.repository";
import { AuthService } from "./auth.service";
import { AuthResponseDto } from "../dto/auth-response.dto";

export class UserService {
  private userRepository = new UserRepository();
  private authService = new AuthService();

  public async signUp(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOneByEmail(email);
    if (user) throw new ConflictException('This email already taken');

    const id = v4();
    const hashedPassword = await hash(password, 10);

    const accessToken = this.authService.signAccessToken({ id, email });
    const refreshToken = this.authService.signRefreshToken({ id, email });

    if (!accessToken || !refreshToken)
      throw new Error('Error while creating tokens');

    await this.userRepository.create({
      id,
      email,
      password: hashedPassword,
      refreshToken
    });

    return { id, accessToken, refreshToken };
  }

  public async signIn(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) throw new NotFoundException('User Not Found');

    const isValid = await compare(password, user.password);
    if (!isValid) throw new UnauthorizedException();

    const accessToken = this.authService.signAccessToken({ id: user.id, email: user.email });
    if (!accessToken) throw new Error('Error while creating tokens');

    return { id: user.id, accessToken, refreshToken: user.refreshToken };
  }
}