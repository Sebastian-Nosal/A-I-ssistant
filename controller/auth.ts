import { http } from "./controller.js";
import { Request, Response } from "express";
import { PrismaClient, User } from '@prisma/client'
import { createToken, readToken } from "../utils/tokens.js";
import user, { EMAIL_REGEX } from "./user.js";
import { sendEmail } from "../utils/mail.js";
import { decode as base64decode, encode } from "base64-arraybuffer";
import { generateRegistrationOptions,verifyRegistrationResponse,generateAuthenticationOptions,verifyAuthenticationResponse } from '@simplewebauthn/server';
import type { AuthenticatorTransportFuture, CredentialDeviceType } from '@simplewebauthn/types';

const prisma = new PrismaClient()

type Authenticator = {
    credentialID: Uint8Array;
    credentialPublicKey: Uint8Array;
    counter: number;
    credentialDeviceType: CredentialDeviceType;
    credentialBackedUp: boolean;
    transports?: AuthenticatorTransportFuture[];
  };

const rpName = 'A[I]ssistant';
const rpID = 'localhost';
const origin = `https://${rpID}:3000`;

class Auth
{
    @http
    async setPin(req:Request,res:Response)
    {
        const {token,user_id,pin} = req.body

        if(token&&user_id&&pin)
        {   
            const decoded:any = readToken(token)
            if(decoded.user_id === user_id)
            {
                const temp = await prisma.twoFA.findFirst({
                    where:{
                        user_id: user_id
                    }
                })

                if(temp)
                {
                    const newFA = await prisma.twoFA.update({
                        where:{
                            user_id: user_id
                        },
                        data: {
                            method: 1,
                            value: pin
                        }
                    })

                    return true
                }
                else
                {
                    const newFA = await prisma.twoFA.create({
                        data: {
                            method: 1,
                            value: pin,
                            user_id: user_id
                        }
                    })

                    return true
                }
            }
            else return false
        }
        else return false
    }

    @http
    async checkPin(req:Request,res:Response)
    {
        const {pin,user_id} = req.body
        if(pin&&user_id)
        {
            const factor = await prisma.twoFA.findFirst({
                where:{
                    user_id: user_id
                }
            })

            if(pin===factor?.value)
            {
                const user = await prisma.user.findFirst({
                    where: {
                        user_id: user_id
                    }
                })
                if(user)
                {
                    const jwt = createToken(user);
                    return {username:user.login,user_id:user.user_id,jwt:jwt};
                }
            }
            else return false;
        }
        else return false
    }

    @http
    async setMail(req:Request,res:Response)
    {
        const {token,user_id} = req.body

        if(token&&user_id)
        {   
            const decoded:any = readToken(token)
            if(decoded.user_id === user_id)
            {
                const email = (await prisma.user.findFirst({where:{user_id: user_id}}))?.email
                const temp = await prisma.twoFA.findFirst({
                    where:{
                        user_id: user_id
                    }
                })

                if(temp)
                {
                    const newFA = await prisma.twoFA.update({
                        where:{
                            user_id: user_id
                        },
                        data: {
                            method: 2,
                            value: ""
                        }
                    })

                    return true
                }
                else
                {
                    const newFA = await prisma.twoFA.create({
                        data: {
                            method: 2,
                            value: "",
                            user_id: user_id
                        }
                    })

                    return true
                }
            }
            else return false
        }
        else return false
    }

    @http
    async sendMail(req:Request,res:Response)
    {
        const {user_id} =req.body
        if(user_id)
        {
            const acc = await prisma.user.findFirst({where:{
                user_id: user_id,
            }})

            if(acc)
            {
                const code = ""
                for(let i=0;i<8;i++)
                {
                   code.concat((Math.random()*10).toString())
                }

                await prisma.twoFA.update({
                    where: {
                        user_id:user_id
                    },
                    data: {
                        value : code
                    }
                })
                
                const email = acc.email
                sendEmail(email,"Login",`Your code is: ${code}`)
            }
        }
        else return false;
    }

    @http
    async checkMail(req:Request,res:Response)
    {
        const {code,user_id} = req.body
        if(code&&user_id)
        {
            const factor = await prisma.twoFA.findFirst({
                where:{
                    user_id: user_id
                }
            })

            if(code===factor?.value)
            {
                const user = await prisma.user.findFirst({
                    where: {
                        user_id: user_id
                    }
                })
                if(user)
                {
                    const jwt = createToken(user);
                    return {username:user.login,user_id:user.user_id,jwt:jwt};
                }
            }
            else return false;
        }
        else return false
    }

    @http
    async getRegisterU2f(req:Request,res:Response)
    {

        if(req.headers.token)
        {
            const token = req.headers.token;

            try 
            {
                const user1:User|null= readToken(token)||null;
                if(user1)
                {
                    const user = await prisma.user.findFirst({where:{
                        user_id: user1.user_id
                    }})

                    let  registrationOptions
                    if(user&&user.user_id == user1.user_id)
                    {
                        registrationOptions = await generateRegistrationOptions({
                            rpName,
                            rpID,
                            userID: user.user_id.toString(),
                            userName: user.login,
                            attestationType: 'none',
                           
                        });

                        if(await prisma.twoFA.findFirst({where:{user_id: user.user_id}})) 
                        {
                            await prisma.twoFA.update({
                                data:{
                                    method: 3,
                                    value: registrationOptions.challenge
                                },
                                where:{
                                    user_id: user.user_id
                                }
                            })
                        }
                        else
                        {
                            await prisma.twoFA.create({
                                data:{
                                    user_id: user.user_id,
                                    value: registrationOptions.challenge,
                                    method: 3
                                }
                            })
                        }
                    }
                    else return false;
                    return registrationOptions
                }
                else return false

            }
            catch(err) 
            {

                return false
            }
        }
        else return false;
       
    }

    @http
    async postRegisterU2f(req:Request,res:Response)
    {
        if(req.body&&req.headers.token)
        {
            const token = req.headers.token;
            try 
            {
                const user:User|null= readToken(token)||null;
                const {rawId} = req.body
            
                if(user&&rawId)
                {
                    const twofa = (await prisma.twoFA.findFirst({where:{user_id:user.user_id}}))
                    const challenge = twofa?.value
                    if(!challenge) return false
                    const response = req.body
                    const attestationExpectations = {
                        response: response,
                        expectedChallenge: challenge,
                        expectedOrigin: origin,
                        expectedRPID: rpID,
                    }

                    const regResult = await verifyRegistrationResponse(attestationExpectations);
                    if(!regResult||!regResult.registrationInfo) return false
                    else 
                    {
                        const {credentialPublicKey,credentialID,counter,credentialDeviceType,credentialBackedUp} = regResult.registrationInfo
                        const newAuthenticator: Authenticator = {
                            credentialID,
                            credentialPublicKey,
                            counter,
                            credentialDeviceType,
                            credentialBackedUp,
                            transports: req.body.transports
                        };
    
                        const newValue = {
                        credentialID: encode(credentialID),
                        credentialPublicKey: encode(credentialPublicKey),
                        counter,
                        credentialDeviceType,
                        credentialBackedUp,
                        transports: req.body.transports
                        }
    
                        await prisma.twoFA.update({
                            data:{
                                value: JSON.stringify(newValue)
                            },
                            where:{
                                user_id: user.user_id
                            }
                        })
    
                        return true;
                    }  
                }
            }
            catch(e:any)
            {
                return false
            }
        }
        else return false
    }

    @http
    async getLoginU2f(req:Request,res:Response)
    {
        const userId:string = req.headers.user_id as string
        if(userId)
        {
            const user = await prisma.user.findFirst({where: {user_id: parseInt(userId)}});
            
            if(user)
            {
                const twoFA = (await prisma.twoFA.findFirst({where:{user_id:user.user_id}}))
                if(twoFA)
                {
                    const authenticator = JSON.parse(twoFA.value);

                    const loginOpt = await generateAuthenticationOptions({
                        rpID,
                        allowCredentials: [{
                            id: authenticator.credentialID,
                            type: 'public-key',
                        }],
                        userVerification: 'preferred',
                      });

                    const challenge = loginOpt.challenge
                    const toReturn = {
                        ...loginOpt,
                        challenge:challenge,
                        allowCredentials: [{
                            id: authenticator.credentialID,
                            type: 'public-key',
                            transports: authenticator.transports
                        }],
                    }

                    const newValue = {...JSON.parse(twoFA.value),challenge:challenge}
                    await prisma.twoFA.update({
                        where:{
                            user_id: user.user_id
                        },
                        data: {
                            value: JSON.stringify(newValue)
                        }
                    })
                
               const secondToken = createToken({challenge})
                
                return toReturn;
            }
            }
            else return false;
        }
        else return false;
    }

    @http
    async postLoginU2f(req:Request,res:Response)
    {
        const {userId,response}= req.body
        if(userId&&response)
        {
            try 
            {
                const fa = await prisma.twoFA.findFirst({
                    where: {user_id:userId}
                })
                if(!fa) return false

                const authenticator = JSON.parse(fa?.value);
                authenticator.credentialID = base64decode(authenticator.credentialID)
                authenticator.credentialPublicKey = base64decode(authenticator.credentialPublicKey)
                const expectedChallenge = authenticator.challenge
                delete authenticator.challenge
                const verification = await verifyAuthenticationResponse({
                    response: response,
                    expectedChallenge,
                    expectedOrigin: origin,
                    expectedRPID: rpID,
                    authenticator,
                  });
                const {verified } = verification
                if(verified)
                {
                    const {newCounter} = verification.authenticationInfo
                    authenticator.counter = newCounter;
                    authenticator.credentialID = encode(authenticator.credentialID)
                    authenticator.credentialPublicKey = encode(authenticator.credentialPublicKey)
                    await prisma.twoFA.update({where:{user_id:userId},data:{value: JSON.stringify(authenticator)}})
                    const user =  await prisma.user.findFirst({where:{user_id:userId}});
                    const token = createToken(user);
                    return token
                } 
                else return false
            }
            catch(e)
            {
                return false;
            }
        }
        return false
    }
}

export default new Auth();