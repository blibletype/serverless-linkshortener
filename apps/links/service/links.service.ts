import { nanoid } from 'nanoid';
import { LinksRepository } from "../repository/links.repository";
import {NotFoundException, UnauthorizedException} from "../../utils/api-error";
import { LinkDto } from "../dto/link.dto";

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

    if (item.userId !== userId) throw new UnauthorizedException();

    await this.linksRepository.destroy(linkId);
  }

  public async findAll(userId: string): Promise<LinkDto[]> {
    return await this.linksRepository.findAllByUserId(userId);
  }
}