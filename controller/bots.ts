import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

class BotListController 
{
    async getAllBots(req:Request,res:Response)
    {
        const bots = await prisma.bot.findMany();
        res.status(200).send(bots)
    }

    async addNewBot(req:Request,res:Response)
    {
        const {url,name} = req.body
        
        if(req.headers.admin==="1"&&url&&name&&req.headers.token==="QWERTYUIOP!@#$%^&*()")
        {
            const newBot = await prisma.bot.create({data:{
                api_url: url,
                bot_name: name 
            }})
            res.status(200).send()
        }
        else res.status(400).send('ERROR')
    }
}

export default new BotListController();