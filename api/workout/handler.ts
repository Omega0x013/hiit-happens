import { FunctionContext, FunctionEvent } from './runtime.ts';
import pg from 'pg';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const jwtSecret = fs.readFileSync('/var/openfaas/secrets/jwt', 'utf-8') as string | undefined;
const psqlConnString = fs.readFileSync('/var/openfaas/secrets/psql', 'utf-8') as string|undefined;

if(jwtSecret == null){
  throw new Error('JWTSecret is not set');
}

if(psqlConnString == null){
  throw new Error('POSTGRES_CONN is not set');
}

function getId(jwtStr: string): number|undefined {
    
  if(jwtSecret == null){
    throw new Error('JWTSecret is not set');
  }

  try{
    const data = jwt.verify(jwtStr, jwtSecret as string) as {id: number};
    return data.id;
  }catch(ex){
    return undefined;
  }
}



export default async function handler(
  event: FunctionEvent, 
  context: FunctionContext, 
  callback: (err: unknown, succ?: unknown|undefined) => void
): Promise<unknown> {

  const cookieHeader = cookie.parse(event.headers['cookie'] ?? '');
  const userId = getId(cookieHeader['Authentication'] ?? '');

  if(userId == null){
    context.status(418);
    return;
  }

  switch (event.method){
    case 'GET': {
      
    }
    case 'PUT': {
      
    }
    case 'DELETE': {

    }
    case 'POST': {

    }
  }

  return {};
}