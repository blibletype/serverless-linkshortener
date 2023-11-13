import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  AttributeValue,
  UpdateItemCommand,
  ScanCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';
import { CreateLinkDto, LinkDto } from "../dto/link.dto";

const tableName = process.env.LINKS_TABLE;

export class LinksRepository {
  private client = new DynamoDBClient();

  public async create(link: CreateLinkDto): Promise<void> {
    const params = {
      TableName: tableName,
      Item: {
        id: { S: link.id },
        originLink: { S: link.originLink },
        userId: { S: link.userId },
        visits: { N: link.visits.toString() },
        expiresIn: { S: link.expiresIn },
        createdAt: { S: link.createdAt }
      }
    }
    const command = new PutItemCommand(params);
    await this.client.send(command);
  }

  public async findOneById(id: string): Promise<LinkDto | null> {
    const params = {
      TableName: tableName,
      Key: { id: { S: id } }
    }
    const command = new GetItemCommand(params);
    const response = await this.client.send(command);
    if (!response.Item) return null;
    return this.mapDynamoDBItemToLinkDto(response.Item);
  }

  public async findAll(): Promise<LinkDto[]> {
    const params = { TableName: tableName };
    const response = await this.client.send(new ScanCommand(params));
    if (response.Items && response.Items.length > 0) {
      return response.Items.map((item) => this.mapDynamoDBItemToLinkDto(item));
    } else {
      return [];
    }
  }

  public async findAllByUserId(userId: string): Promise<LinkDto[]> {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":id": { S: userId }
      },
      FilterExpression: "userId = :id",
    };
    const command = new ScanCommand(params);
    const response = await this.client.send(command);

    if (response.Items && response.Items.length > 0) {
      return response.Items.map((item) => this.mapDynamoDBItemToLinkDto(item));
    } else {
      return [];
    }
  }

  public async updateVisitsById(id: string, visits: number): Promise<void> {
    const params = {
      TableName: tableName,
      Key: { id: { S: id } },
      UpdateExpression: 'SET visits = :visits',
      ExpressionAttributeValues: {
        ':visits': { N: visits.toString() }
      }
    }
    const command = new UpdateItemCommand(params);
    await this.client.send(command);
  }

  public async destroy(id: string): Promise<void> {
    const params = {
      TableName: tableName,
      Key: { id: { S: id } },
    }
    const command = new DeleteItemCommand(params);
    await this.client.send(command);
  }

  private mapDynamoDBItemToLinkDto(item: { [key: string]: AttributeValue }): LinkDto {
    return {
      id: item.id.S || "",
      originLink: item.originLink.S || "",
      visits: Number(item.visits.N) || 0,
      userId: item.userId.S || "",
      expiresIn: item.expiresIn.S || "",
      createdAt: item.createdAt.S || "",
    };
  }
}