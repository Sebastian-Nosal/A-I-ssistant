import axios from 'axios';
import { Request, Response } from 'express';
import { readToken } from '../utils/tokens.js';
import templates from '../language/tasks.json' assert {type: 'json'};

class MathAI
{
    async handle(req:Request, res: Response)
    {
        const token = req.headers.token  
        let {content } = req.body
        content = content.toLowerCase() as string;
        if(token&&content)
        {
            const user =  readToken(token);
            if(user)
            {
                let task:number = -1 
                let command:string = ""

                const template = JSON.parse(JSON.stringify(templates))
                template.help.map(el=>{
                    if(content.includes(el)) 
                    {
                        task = 0
                    }
                })

                template.graph.map(el=>{
                    if(content.includes(el)) 
                    {
                        task = 1
                        const idx = content.search(/[a-z]\([a-z]\)/ig)
                        const temp = content.slice(idx)
                        const idx2 = temp.search(/[a-z]{3,}/g)
                        command = temp.split(idx2)[0]
                    }
                })

                templates.zeros.map(el=>{
                    if(content.includes(el)) 
                    {
                        task = 2
                        const idx = content.search(/[a-z]\([a-z]\)/ig)
                        const temp = content.slice(idx)
                        const idx2 = temp.search(/[a-z]{3,}/g)
                        command = temp.split(idx2)[0]                    }
                })

                templates.deriverate.map(el=>{
                    if(content.includes(el)) 
                    {
                        task = 3
                        const idx = content.search(/[a-z]\([a-z]\)/ig)
                        const temp = content.slice(idx)
                        const idx2 = temp.search(/[a-z]{3,}/g)
                        command = temp.split(idx2)[0]                    }
                })

                templates.monotonicy.map(el=>{
                    if(content.includes(el)) 
                    {
                        task = 4
                        const idx = content.search(/[a-z]\([a-z]\)/ig)
                        const temp = content.slice(idx)
                        const idx2 = temp.search(/[a-z]{3,}/g)
                        command = temp.split(idx2)[0]                    }
                })

                templates.domain.map(el=>{
                    if(content.includes(el)) {
                        task = 5
                        const idx = content.search(/[a-z]\([a-z]\)/ig)
                        const temp = content.slice(idx)
                        const idx2 = temp.search(/[a-z]{3,}/g)
                        command = temp.split(idx2)[0]                    }
                })

                templates.lim.map(el=>{
                    if(content.includes(el)) 
                    {
                        task = 6
                        const idx = content.indexOf("lim")
                        const temp = content.slice(idx)
                        const idx2 = temp.indexOf("]")+1
                        command = temp.split(idx2)[0]                    
                    }
                })

                templates.equasion.map(el=>{
                    if(content.includes(el)) 
                    {
                        task = 7
                        command = ""
                    }
                })
                
                try {

                    const response = await axios.post('http://127.0.0.1:8080/solve',{
                        task: task,
                        data: command
                    })
                   
                
                    if(response)
                    {
                        res.status(200).send(response.data.data)
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

export default new MathAI()