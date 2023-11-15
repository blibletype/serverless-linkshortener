import { nanoid } from 'nanoid';
import { LinksRepository } from "../repository/links.repository";
import {ForbiddenException, NotFoundException, UnauthorizedException} from "../../utils/api-error";
import { LinkDto } from "../dto/link.dto";
import { sendToEmailQueue } from "../../utils/send-to-email-queue";


export class LinksService {
  private linksRepository = new LinksRepository();

  public async create(originLink: string, expiresIn: string = '', userId: string): Promise<string> {
    const length = process.env.LINK_ID_LENGTH ? parseInt(process.env.LINK_ID_LENGTH) : 6;
    const id = nanoid(length);
    const createdAt = new Date().toISOString();
    const visits = 0;

    await this.linksRepository.create({ id, originLink, visits, createdAt, expiresIn, userId });

    return id;
  }

  public async findOriginLink(linkId: string): Promise<string> {
    const item = await this.linksRepository.findOneById(linkId);

    if (!item) throw new NotFoundException();

    if (!item.expiresIn) {
      await this.linksRepository.destroy(linkId);
      return item.originLink;
    }

    await this.linksRepository.updateVisitsById(linkId, ++item.visits);
    return item.originLink;
  }

  public async destroy(linkId: string, userId: string): Promise<void> {
    const item = await this.linksRepository.findOneById(linkId);

    if (!item) throw new NotFoundException();

    if (item.userId !== userId) throw new ForbiddenException();

    await this.linksRepository.destroy(linkId);

    const message = `
      Your link: ${item.originLink} has been deactivated.
      Visits: ${item.visits}
      `;
    await sendToEmailQueue(userId, message);
  }

  public async findAll(userId: string): Promise<LinkDto[]> {
    return await this.linksRepository.findAllByUserId(userId);
  }

  public async destroyExpired(): Promise<void> {
    const items = await this.linksRepository.findAll();
    for (const item of items) {
      if (!item.expiresIn) continue;

      const isExpired = this.isExpired(item.createdAt, item.expiresIn);
      if (!isExpired) continue;

      await this.linksRepository.destroy(item.id);

      const message = `
      Your link: ${item.originLink} has been expired.
      Visits: ${item.visits}
      `;
      await sendToEmailQueue(item.userId, message);
    }
  }

  private isExpired(createdAtISO: string, expiresIn: string): boolean {
    const createdAt = new Date(createdAtISO);

    const value = Number(expiresIn.at(0));

    createdAt.setDate(createdAt.getDate() + value);

    const currentTime = new Date().toISOString();
    return currentTime > createdAt.toISOString();
  }
}