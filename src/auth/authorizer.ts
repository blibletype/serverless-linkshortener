import { AuthService } from "./services/auth.service";

const authService = new AuthService();

export const isAuthenticated = async (event: any) => {
  if (!event.headers.authorization) return generatePolicy('user', 'Deny', event.routeArn);

  const token = event.headers.authorization.substring(7);
  if (!token) return generatePolicy('user', 'Deny', event.routeArn);

  const decoded = authService.verifyAccessToken(token);
  if (!decoded) return generatePolicy('user', 'Deny', event.routeArn);

  return generatePolicy(decoded.id, 'Allow', event.routeArn);
}

const generatePolicy = (principalId: string, effect: 'Allow' | 'Deny', resource: string) => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }]
    },
    context: {
      userId: principalId
    }
  };
};