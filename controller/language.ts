import { NextFunction, Request, Response } from 'express'
import { Controller,http } from './controller.js'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class languageController implements Controller 
{
    
    @http
    async get(req: Request, res: Response, next: NextFunction) {
        if(req.params.code)
        {
            const query = req.params.code.toUpperCase()
            const result = await prisma.language.findFirst({
                where: {
                    OR: [
                        {code_alpha2 : query.toUpperCase()},
                        {code_alpha3 : query.toLocaleUpperCase()},
                    ]
                }
            })
            if(result)
            {
                const file = result.language_file;
                let translation = fs.readFileSync('../Back-End/language/'+file,'utf-8')
                return JSON.parse(translation);
            }
            else
            {
                return false;
            }
        }
        else return false;
    }

    @http
    async post(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        const {code2,code3,language_file,flag_file} = req.body
        if(code2&&code3&&language_file&&flag_file)
        {
            await prisma.language.create({
                data:{
                    code_alpha2: code2.toUpperCase(),
                    code_alpha3: code3.toUpperCase(),
                    language_file: language_file,
                    flag_file: flag_file
                }
            })
            return true
        }
        else
        {
            return false
        }
    }
}

export default new languageController();