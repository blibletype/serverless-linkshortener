import { DynamoDB } from 'aws-sdk';

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: '130.61.78.62',
    endpoint: 'http://130.61.78.62:8000',
  };
}

const documentClient = new DynamoDB.DocumentClient(options);

export const create = async (item: any) => {
  await documentClient.put(
    {
      TableName: 'UsersTable',
      Item: item,
    },
    (err, data) => {
      if (err) console.log(err);
      if (data) console.log(data);
    }
  );
};
