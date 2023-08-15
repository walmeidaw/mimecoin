import { TokenAuth } from "@/lib/auth/token";
import { AuthAccount } from "@/lib/controller/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest){
    let auth = null;

    try {
        auth = await TokenAuth( request );
    } catch ( error : any ) {
        return NextResponse.json({
            status: 401,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 401 })
    }

    const { id, account, digit, password, idCustomer } : {
        id: string, 
        idCustomer: string,
        account : string ,
        digit : string, 
        password : string,
    } = await request.json();

    if(
        id == null || id == '' || 
        idCustomer == null || idCustomer == '' || 
        account == null || account == '' ||
        digit == null || digit == '' ||
        password == null || password == ''
    ){
        throw new Error("All fields should be setted.");
    }

    try{
        await AuthAccount.SetPassword(id, idCustomer, auth.namespace.code, account+digit, password )
        return NextResponse.json({
            status: 200,
            message: "Password setted.",
            timestamp: new Date().getTime()
        });
    }catch( error : any ){
        return NextResponse.json({
            status: 400,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 400 })
    }
}