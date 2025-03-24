import { FunctionContext, FunctionEvent } from './runtime.ts';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import z from 'zod';

const googleSecret = process.env.GOOGLE_SECRET;
const googleId = process.env.GOOGLE_ID;
const jwtSecret = process.env.JWT_SECRET;

if(googleSecret == null){
  throw new Error('Missing ENV variable: "GOOGLE_SECRET".');
}

if(googleId == null){
  throw new Error('Missing ENV variable: "GOOGLE_ID".');
}

if(jwtSecret == null){
  throw new Error('JWTSecret is not set');
}

const oAuth2Client = new google.auth.OAuth2(
  googleId,
  googleSecret,
  'http://localhost:8080/auth/callback'
);

const oauth2CallbackURLQuery = z.object({
  code: z.string(),
  error: z.string().optional()
});

async function getPersonDetails(idToken: string): Promise<undefined|string>{
  const ticket = await oAuth2Client.verifyIdToken({
    idToken
  });

  const payload = ticket.getPayload();

  if(payload == null){
    return undefined;
  }

  const userId = payload.sub;
  console.log('Authing:', payload.name);
  return userId;
}

export default async function handler(
  event: FunctionEvent, 
  context: FunctionContext, 
  callback: (err: unknown, succ?: unknown|undefined) => void
): Promise<unknown> {
  console.log('PATh;', event.path)
  if(event.path === '/auth'){
    return oAuth2Client.generateAuthUrl({
      include_granted_scopes: true,
      scope: ['openid']
    });
  }
  else if(event.path === '/auth/callback'){
    const query = oauth2CallbackURLQuery.safeParse(event.query);
    
    if(!query.success){
      context.status(500);
      return {};
    }

    if(query.data.error){
      
      return {
        error: query.data.error
      };
    }
    
    const tokenResults = await oAuth2Client.getToken(query.data.code);

    if(tokenResults.tokens == null){
      return {
        error: 'token auth error!'
      };
    }

    const idToken = tokenResults?.tokens?.id_token

    if(idToken == null){
      return {
        error: 'Id token null'
      }
    }

    const authId = await getPersonDetails(idToken);
    if(authId == null){
      return {
        error: 'Invalid IDToken'
      };
    }

    context.status(200)
    context.headers({
      responseType: 'application/json',
      ['Set-Cookie']: `authentication=${jwt.sign({id: authId}, jwtSecret as string)}; Path=/;HttpOnly;`
    })

    return {
      data: await getPersonDetails(idToken)
    }
  }
}