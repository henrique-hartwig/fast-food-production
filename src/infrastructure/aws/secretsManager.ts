import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export const getDbCredentials = async () => {
  const client = new SecretsManagerClient({ region: 'us-east-1' });
  const response = await client.send(new GetSecretValueCommand({ SecretId: 'fast-food-orders-db-credentials' }));
  return JSON.parse(response.SecretString || '{}');
};