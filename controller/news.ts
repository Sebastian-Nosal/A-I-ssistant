import axios from 'axios';
import { Request, Response } from 'express';
import { readToken } from '../utils/tokens.js';
import { Readable } from 'stream';
import templates from '../language/news.json' assert {type: 'json'};
import fs from 'fs'

class News
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
            
                const {language,category,country} = template

                let selectedLanguage = "pl"
                let selectedCategory = ""
                let selectedCountry = ""
                
                for(let key in category)
                {
                    category[key].map(el=>{
                        if(content.includes(el))
                        {
                            selectedCategory = key;
                        }
                    })
                }

                for (let key in language)
                {
                    language[key].map(el=>{
                        if(content.includes(el))
                        {
                            selectedLanguage = key;
                        }
                    })
                }

                for (let key in country)
                {
                    country[key].map(el=>{
                        if(content.includes(el))
                        {
                            selectedCountry = key;
                        }
                    })
                }
                
                const APIKEY = process.env.News_API
                
                try {

                    let query = ""

                    if(selectedCategory)
                    {
                        query+=`&category=${selectedCategory}`;
                    }

                    if(selectedLanguage)
                    {
                        query+=`&language=${selectedLanguage}`;
                    }

                    if(selectedCountry)
                    {
                        query+=`&country=${selectedCountry}`;
                    }

                    const response = await axios.get(`https://newsdata.io/api/1/news?apikey=${APIKEY}${query}`)
                    
                    if(response)
                    {
                        const tmp = response.data.results
                        let resp ="<ol>"
                        tmp.map(el=>{
                            resp+= `<li> ${el.title} -> <a href="${el.link}">LINK</a> <b>${el.source_url}</b></li>`

                        })
                
                        resp+="</ol>"
                        res.status(200).send(resp)
                    }
                    else res.status(500).send('Invalid response');
                
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

export default new News()