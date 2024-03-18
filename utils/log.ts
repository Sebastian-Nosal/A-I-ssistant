const ender = "\x1b[0m";
const starter = '\x1b[';

const colors = {
    "black": 30,
    "red": 31,
    "green":32,
    "yellow":33,
    "blue":34,
    "white":37
}

export function serverStart(port:Number)
{
    const log = `${starter}${colors.green}m Status OK ${ender} \n\n${starter}${colors.yellow}m Server listening on Port${ender} ${starter}${colors.red}m ${port} ${ender}`
}

export function error(code:String,content:String)
{
    const log = `${starter}${colors.red}m ${code} -> ${content} ${ender}`
}

export default {}
