import { SES, SendEmailCommandInput } from '@aws-sdk/client-ses';

const ses = new SES();

export const sendEmail = async (event: any) => {
  for (const record of event.Records) {
    try {
      const messageAttributes = record.messageAttributes;
      const email: SendEmailCommandInput = {
        Source: process.env.SENDER_EMAIL_ADDRESS,
        Destination: {
          ToAddresses: [messageAttributes.email.stringValue]
        },
        Message: {
          Body: {
            Text: {
              Data: messageAttributes.message.stringValue,
              Charset: "UTF-8"
            }
          },
          Subject: {
            Data: record.body,
            Charset: 'UTF-8',
          }
        }
      }
      await ses.sendEmail(email);
    } catch (error) {
      console.log(error);
      continue;
    }
  }
}