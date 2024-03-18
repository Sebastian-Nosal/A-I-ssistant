import type { Request,Response } from 'express';
import { BotController } from './controller.js';
import { readToken } from '../utils/tokens.js';
import type Ollama  from 'ollama';
import ollama from 'ollama'

 class CodeAIController //implements BotController
{
    async handle(req:Request,res:Response)
    {
        const token = req.headers.token  
        const {content} = req.body
        if(token&&content)
        {
            const user =  readToken(token);
            if(user)
            {
                const model:string = 'codellama';
                const message = { role: 'user', content: "write only requested code to given task: "+content+". Don't write any comments and descriptions." }
                try {
                    const response = await ollama.chat({model:model,messages:[message],keep_alive: -1,stream:true})
                    if(response)
                    {
                        res.status(200)
                        for await (const part of response) {
                            //process.stdout.write(part.message.content)
                            res.write(part.message.content)
                        }
                        res.end();
                    }
                    else res.status(500).send('Invalid AI response');
                
                }
                catch(e)
                {
                    res.status(500).send("Internal Problem")
                }
            }
            else res.status(400).send('invalid token');
        }
        else res.status(400).send('missing token')
    }
}

export default new CodeAIController();