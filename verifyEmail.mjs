import { SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';

const run = async () => {
  try {
    const email = process.env.SENDER_EMAIL_ADDRESS;
    const ses = new SESClient({ region: process.env.REGION });
    ses.send(new VerifyEmailIdentityCommand({ EmailAddress: email }));
  } catch (error) {
    console.log(error);
  }
}

run();