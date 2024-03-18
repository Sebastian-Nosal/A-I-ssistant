import bcrypt from 'bcrypt';

export function encrypt(password:string):string
{
    const saltRounds = parseInt(process.env.saltRounds||'10');
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export function compare(hash:string, password:string):boolean
{
    if(hash&&password)
    {
        const result = bcrypt.compareSync(password, hash); // true
        if(result) return true
        else return false;
    }
    return false
}
