import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 } from 'uuid';
import { create } from '../common/database';

const headers = {
  'content-type': 'application/json',
};

export async function signUp(event: APIGatewayProxyEvent) {
  const reqBody = JSON.parse(event.body as string);

  const user = {
    ...reqBody,
    userId: v4(),
  };

  await create(user);

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(user),
  };
}
