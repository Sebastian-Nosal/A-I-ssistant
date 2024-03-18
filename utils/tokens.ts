import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';


const privateKey:string = process.env.private_key||'secret';

export function createToken(data:any)
{
    if(data)
    {
        const token = jwt.sign(data,privateKey,{algorithm:'HS256', expiresIn: 60*60*24})
        return token;
    }
    else return false;
}

export function readToken(token:any)
{
    if(token)
    {
        try
        {
            //@ts-ignore
            const decoded:User = jwt.verify(token,privateKey);
            return decoded;
        }
        catch(e)
        {
            return false;
        }
    }
}