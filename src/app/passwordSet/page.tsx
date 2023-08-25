import crypto from 'crypto';
import { Account } from "@/lib/controller/account";
import { AuthAccount } from '@/lib/controller/auth';
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Password set',
}

export default async function Page( props : any ) {
  let error : string | null = null;
  let _redirect : boolean = false;

  try {
    if(isSubmit(props)){
      const result = await setPassword(props.searchParams)
      if(result){
        _redirect = true;
      }
    }
  } catch (_error : any) {
    _redirect = true;
    error = _error.message;
  }

  if( _redirect ){
    redirect('./passwordSet/ok')
  }

  return <div>
    <Toast message={ error } />
    <form>
      <input type="hidden" readOnly name="userToken" defaultValue={ props.searchParams.userToken }  />
      <input type="password" name="password" defaultValue={ props.searchParams.password } required min={4}/>
      <button type="submit">Enviar</button>
    </form>
  </div>
}

function isSubmit( props: any) {
  if(!Object.keys(props.searchParams).includes('userToken')){
    throw new Error("Missing user token");
  }else if(!Object.keys(props.searchParams).includes('password')){
    return false;
  }else if(props.searchParams.password?.length < 4){
    throw new Error("Password must have 4 or more characteres.");
  }else if(!!!props.searchParams.password){
    return false;
  }

  return true;
}

async function setPassword({ userToken, password } : { userToken : string, password : string }){
  const decoded = decrypt( userToken ) as string;

  const data = JSON.parse( decoded );

  const acc = await Account.get( data.id, data.idCustomer );

  if( acc == null ){
    throw new Error("Account not exist.")
  }

  if( acc.accountPassword != null ){
    throw new Error("Password already setted.")
  }
  
  await AuthAccount.SetPassword(acc.id, acc.idCustomer, acc.namespaceCode, acc.accountNumber+acc.accountKey, password );

  return true;
}

const decrypt = ( content : string ) => {
  try {
    const textParts = content.split(':') as Array<String>;
    const iv = Buffer.from(textParts.shift() as any, 'hex');

    const encryptedData = Buffer.from(textParts.join(':'), 'hex');
    const key = crypto.createHash('sha256').update( process.env.NEXTAUTH_CRYPTO || 'USER_CRYTO_KEY' ).digest('base64').substr(0, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    const decrypted = decipher.update(encryptedData);
    const decryptedText = Buffer.concat([decrypted, decipher.final()]);
    return decryptedText.toString();
  } catch (error) {
    console.error(error)
  }
}

function Toast({ message }:{ message : string | null }) {
  if( !message ){
    return;
  }

  return <div>{ message }</div>
}