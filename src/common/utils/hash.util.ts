import { compareSync, genSaltSync, hashSync } from "bcrypt"
import { createHash } from "crypto";

export function hashPassword(password:string,salt:number=15){
    const genSalt=genSaltSync(salt)
    return hashSync(password,genSalt);
}
export  function comparePassword(password:string,hashPassword:string){
    return compareSync(password,hashPassword);
}
export function hashSecret(secret:string):string{
 return createHash('sha256').update(secret).digest('hex');   
}