import { LinksService } from "../service/links.service";
import { ResponseUtil } from "../../utils/responce";
import { validateLinkBody } from "../../utils/validator";

export class LinksController {
  private linksService = new LinksService();
  public async create(event: any) {
    try {
      const body = JSON.parse(event.body);

      const { userId } = event.requestContext.authorizer.lambda;

      validateLinkBody(body);

      const { originLink, expiresIn } = body;

      const linkId = await this.linksService.create(originLink, expiresIn, userId);

      const newLink = process.env.BASE_URL + linkId;

      return ResponseUtil.success(201, { newLink, originLink });
    } catch (error: any) {
      return ResponseUtil.error(error);
    }
  }

  public async deactivate(event: any) {
    try {
      const { linkId } = event.pathParameters;
      const { userId } = event.requestContext.authorizer.lambda;

      await this.linksService.destroy(linkId, userId);

      return ResponseUtil.success(
        200,
        { message: `Link with id: ${linkId} deactivated` }
      );
    } catch (error: any) {
      return ResponseUtil.error(error);
    }
  }

  public async redirect(event: any) {
    try {
      const { linkId } = event.pathParameters;

      const originLink = await this.linksService.findOriginLink(linkId);

      return {
        statusCode: 302,
        headers: { Location: originLink },
      };
    } catch (error: any) {
      return ResponseUtil.error(error);
    }
  }

  public async findAll(event: any) {
    try {
      const { userId } = event.requestContext.authorizer.lambda;
      const items = await this.linksService.findAll(userId);

      const formattedItems = items.map((item) => {
        const { id, userId, ...rest } = item;
        return {
          link: process.env.BASE_URL + id,
          ...rest
        }
      });

      return ResponseUtil.success(200, formattedItems);
    } catch (error: any) {
      return ResponseUtil.error(error);
    }
  }

  public async deactivateExpired(event: any) {
    try {
      await this.linksService.deactivateExpired(event.linkId);
    } catch (error: any) {
      console.log(error);
      return ResponseUtil.error(error);
    }
  }
}