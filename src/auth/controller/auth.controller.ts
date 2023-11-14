import { ResponseUtil } from "../../utils/responce";
import { UserService } from "../services/user.service";
import { validateAuthBody } from "../../utils/validator";

export class AuthController {
  private userService = new UserService();

  public async signUp(event: any) {
    try {
      const body = JSON.parse(event.body);

      validateAuthBody(body);

      const response = await this.userService.signUp(body.email, body.password);

      return ResponseUtil.success(201, response);
    } catch (error: any) {
      return ResponseUtil.error(error);
    }
  }

  public async singIn(event: any) {
    try {
      const body = JSON.parse(event.body);

      validateAuthBody(body);

      const response = await this.userService.signIn(body.email, body.password);

      return ResponseUtil.success(200, response);
    } catch (error: any) {
      return ResponseUtil.error(error);
    }
  }
}