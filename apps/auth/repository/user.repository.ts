import { DynamoDBClient, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { UserDto } from '../dto/user';

const tableName = 'usersTable';

export class UserRepository {
  private client = new DynamoDBClient();

  public async findOneByEmail(email: string) {
    const params = {
      TableName: tableName,
      ExpressionAttributeValues: {
        ":emailvalue": { S: email }
      },
      FilterExpression: "email = :emailvalue",
    };
    const command = new ScanCommand(params);
    const responce = await this.client.send(command);
    return responce.Items ? responce.Items[0] : null;
  }

  public async create(user: UserDto) {
    const params = {
      TableName: tableName,
      Item: {
        id: { S: user.id },
        email: { S: user.email },
        password: { S: user.password },
        accessToken: { S: user.accessToken },
        refreshToken: { S: user.refreshToken }
      }
    }
    const command = new PutItemCommand(params);
    await this.client.send(command);
  }
}