import { ResponseUtil } from "../../utils/responce";
import { UserService } from "../services/user.service";
import { validateAuthBody } from "../../utils/validator";

export class AuthController {
  private userService = new UserService();

  public async signUp(event: any) {
    try {
      const body = JSON.parse(event.body);

      validateAuthBody(body);

      const data = await this.userService.create(body.email, body.password);

      return ResponseUtil.success(201, data);
    } catch (error: any) {
      return ResponseUtil.error(error);
    }
  }
}