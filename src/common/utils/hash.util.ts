import { compareSync, genSaltSync, hashSync } from "bcrypt"

export function hashPassword(password:string,salt:number=15){
    const genSalt=genSaltSync(salt)
    return hashSync(password,genSalt);
}
export  function comparePassword(password:string,hashPassword:string){
    return compareSync(password,hashPassword);
}