import { Request, Response } from 'express'
import { http } from './controller.js'
import { Prisma, PrismaClient } from '@prisma/client'
import { compare, encrypt } from '../utils/bcrypt.js';
import { createToken } from '../utils/tokens.js';

const prisma = new PrismaClient()

export const PASSWORD_REGEX: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
export const LOGIN_REGEX: RegExp = /^[a-zA-Z0-9_-]{3,16}$/;
export const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class UserController 
{
    @http
    async postLogin(req:Request,res:Response)
    {
        const {username, password} = req.body;
        if(username&&password)
        {
            if(password.match(PASSWORD_REGEX)&&username.match(LOGIN_REGEX))
            {
                try{
                    const user = await prisma.user.findFirst({
                        where: {
                            login: username
                        }
                    })
                    if(user)
                    {
                        if(compare(user.password,password))
                        {
                            const jwt = createToken(user);
                            const fa = await prisma.twoFA.findFirst({
                               where: {
                                user_id: user.user_id
                               }
                            });

                            if(fa) return {username:user.login,user_id:user.user_id,fa:fa.method};
                            else return {username:user.login,user_id:user.user_id,jwt:jwt};
                        }
                    }
                    else  return false;
                }
                catch(err)
                {
                    if (err instanceof Prisma.PrismaClientKnownRequestError)
                    {
                        if (err.code === 'P2002') {
                            return false
                          }
                    }
                    throw Error('Database Error')
                }
               
                
            }
            else return false;
        }
        return false;
    }

    @http
    async postRegister(req:Request,res:Response)
    {
        const {username, email, password} = req.body;
        if(username&&email&&password)
        {            
            if(password.match(PASSWORD_REGEX)&&email.match(EMAIL_REGEX)&&username.match(LOGIN_REGEX))
            {
                const hash = encrypt(password);
                try 
                {
                    const newUser = await prisma.user.create({
                        data:{
                            email: email,
                            login: username,
                            password: hash
                        }
                    })

                    const jwt = createToken(newUser)
                    return {username:newUser.login,user_id:newUser.user_id,jwt:jwt};;
                }
                catch(err)
                {
                    
                    if (err instanceof Prisma.PrismaClientKnownRequestError)
                    {
                        if (err.code === 'P2002') {
                            return false
                        }
                    }
                    throw err
                }
            }
            else return false 
        }       
        else return false
    }
}

export default new UserController();