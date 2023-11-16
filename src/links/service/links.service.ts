import { nanoid } from 'nanoid';
import { LinksRepository } from "../repository/links.repository";
import { ForbiddenException, NotFoundException } from "../../utils/api-error";
import { LinkDto } from "../dto/link.dto";
import { sendToEmailQueue } from "../../utils/send-to-email-queue";
import { SchedulerClient, CreateScheduleCommand, CreateScheduleCommandInput } from "@aws-sdk/client-scheduler";


export class LinksService {
  private linksRepository = new LinksRepository();
  private scheduler = new SchedulerClient();

  public async create(originLink: string, expiresIn: string = '', userId: string): Promise<string> {
    const length = process.env.LINK_ID_LENGTH ? parseInt(process.env.LINK_ID_LENGTH) : 6;
    const id = nanoid(length);
    const createdAt = new Date().toISOString();
    const visits = 0;

    await this.linksRepository.create({ id, originLink, visits, createdAt, expiresIn, userId });
    if (expiresIn) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + Number(expiresIn.slice(0, -1)));
      await this.createLinkDeactivationJob(id, expirationDate);
    }

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
      Your link: ${process.env.BASE_URL}${item.id} has been deactivated.
      Origin: ${item.originLink}
      Visits: ${item.visits}
      `;
    await sendToEmailQueue(userId, message);
  }

  public async findAll(userId: string): Promise<LinkDto[]> {
    return await this.linksRepository.findAllByUserId(userId);
  }

  public async createLinkDeactivationJob(linkId: string, expirationDate: Date): Promise<void> {
    const formattedDate = expirationDate.toISOString().slice(0, -5);
    const params: CreateScheduleCommandInput = {
      Name: `deactivate-link-${linkId}`,
      FlexibleTimeWindow: { Mode: 'OFF' },
      ScheduleExpression: `at(${formattedDate})`,
      Description: 'test',
      Target: {
        Arn: process.env.DEACTIVATE_EXPIRED_LAMBDA_ARN,
        RoleArn: process.env.ROLE_ARN,
        Input: JSON.stringify({ linkId })
      }
    }
    const command = new CreateScheduleCommand(params);
    await this.scheduler.send(command);
  }

  public async deactivateExpired(linkId: string): Promise<void> {
    const item = await this.linksRepository.findOneById(linkId);

    if (!item) throw new NotFoundException();

    await this.linksRepository.destroy(linkId);

    const message = `
      Your link: ${process.env.BASE_URL}${item.id} has been expired.
      Origin: ${item.originLink}
      Visits: ${item.visits}
      `;
    await sendToEmailQueue(item.userId, message);
  }
}