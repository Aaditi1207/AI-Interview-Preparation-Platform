import { cognitoConfig } from '../auth/cognitoConfig.js';

const COGNITO_IDP_URL = `https://cognito-idp.${cognitoConfig.region}.amazonaws.com/`;

async function cognitoRequest(target, body) {
  const response = await fetch(COGNITO_IDP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.__type || 'Cognito request failed');
  }
  return data;
}

export async function register(email, password) {
  return cognitoRequest('SignUp', {
    ClientId: cognitoConfig.clientId,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: 'email', Value: email }],
  });
}

export async function confirmSignUp(email, code) {
  return cognitoRequest('ConfirmSignUp', {
    ClientId: cognitoConfig.clientId,
    Username: email,
    ConfirmationCode: code,
  });
}

export async function login(email, password) {
  const data = await cognitoRequest('InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: cognitoConfig.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  const result = data.AuthenticationResult;
  if (!result) throw new Error('Authentication failed');

  return {
    idToken: result.IdToken,
    accessToken: result.AccessToken,
    refreshToken: result.RefreshToken,
  };
}
