import { SQSClient, SendMessageCommand  } from '@aws-sdk/client-sqs';
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const sqs = new SQSClient();
const dynamoDb = new DynamoDBClient();

const tableName = process.env.USERS_TABLE;

export const sendToEmailQueue = async (userId: string, message: string): Promise<void> => {
  try {
    const email = await getEmailByUserId(userId);
    if (!email) return;
    const command = new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      MessageAttributes: {
        email: {
          DataType: 'String',
          StringValue: email
        },
        message: {
          DataType: 'String',
          StringValue: message
        }
      },
      MessageBody: 'Link deactivated'
    });
    await sqs.send(command);
  } catch (error) {
    console.log(error);
  }
}

const getEmailByUserId = async (userId: string): Promise<string | null> => {
  try {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: { id: { S: userId } }
    });
    const response = await dynamoDb.send(command);
    if (!response.Item) return null;
    return response.Item.email.S || null;
  } catch (error) {
    return null;
  }
}