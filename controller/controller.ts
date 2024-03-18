import { NextFunction, Request, Response } from 'express'
import {error} from '../utils/log.js'

export interface Controller {
    get(req:Request,res:Response,next:NextFunction):Promise<boolean>|boolean|Promise<Object>
    post(req:Request,res:Response,next:NextFunction):Promise<boolean>|boolean
    delete?(req:Request,res:Response,next:NextFunction):Promise<boolean>|boolean
}

export interface BotController
{
    getStatus(req:Request,res:Response):void 
    handle(req:Request,res:Response):void
}


export function http(target:any,propertyKey: string, descriptor: PropertyDescriptor)
{
    const original = descriptor.value;

    descriptor.value = async function (...args: any[])
    {
        try
        {
            const status = await original.apply(this,args);
            if(status)
            {
                if(typeof status == 'boolean') args[1].status(200).send();
                else args[1].status(200).send(status);
            }
            else if (status==false) 
            {
                args[1].status(400).send(); 

            }
        }
        catch(err:any)
        {
            error(err.name,err.message)
            args[1].status(500).send('Internal Problem')            
        }
    }
}
