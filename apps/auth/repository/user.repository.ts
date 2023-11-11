import { DynamoDBClient, ScanCommand, PutItemCommand, AttributeValue } from '@aws-sdk/client-dynamodb';
import {CreateUserDto, UserDto} from '../dto/userDto';

const tableName = 'usersTable';

export class UserRepository {
  private client = new DynamoDBClient();

  public async findOneByEmail(email: string): Promise<UserDto | null> {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":emailvalue": { S: email }
      },
      FilterExpression: "email = :emailvalue",
    };
    const command = new ScanCommand(params);
    const response = await this.client.send(command);

    if (response.Items && response.Items.length > 0) {
      return this.mapDynamoDBItemToUserDto(response.Items[0]);
    } else {
      return null;
    }
  }

  public async create(user: CreateUserDto): Promise<void> {
    const params = {
      TableName: tableName,
      Item: {
        id: { S: user.id },
        email: { S: user.email },
        password: { S: user.password },
        refreshToken: { S: user.refreshToken }
      }
    }
    const command = new PutItemCommand(params);
    await this.client.send(command);
  }

  private mapDynamoDBItemToUserDto(item: { [key: string]: AttributeValue }): UserDto {
    return {
      id: item.id.S || "",
      email: item.email.S || "",
      password: item.password.S || "",
      refreshToken: item.refreshToken.S || "",
    };
  }
}