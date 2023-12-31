import { TokenAuth } from "@/lib/auth/token";
import { AuthAccount } from "@/lib/controller/auth";
import { Actions, Logging } from "@/lib/core/logging";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){
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

    const { searchParams } = new URL(request.url)
    const account = searchParams.get('account') || null
    const digit = searchParams.get('digit') || null

    if( !account || !digit){
        return NextResponse.json({
            status: 401,
            message : "Account and digit are required.",
            timestamp: new Date().getTime()
        },{ status : 401 })
    }

    try {
        const account_status = await AuthAccount.LoginReady( auth.namespace.code, account + digit );

        if( account_status )
    
        return NextResponse.json({
            account_status,
            status: 200,
            timestamp: new Date().getTime()
        });
    } catch (error : any) {
        return NextResponse.json({
            status: 401,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 401 })
    }
}

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

    const { account, digit, password } : {
        account? : string ,
        digit? : string, 
        password? : string
    } = await request.json();


    if( !account || !digit || !password ){
        return NextResponse.json({
            status: 400,
            message : "Missing data to login.",
            timestamp: new Date().getTime()
        },{ status : 400 })
    }

    try{
        const account_auth = await AuthAccount.Login( auth.namespace.code, account + digit, password );

        await Logging({ 
            namespaceCode: auth.namespace.code,
            action: Actions.login,
            payload: { 
                id : account_auth.user.id,
            }
        })

        return NextResponse.json({
            data: { token : account_auth.token },
            status: 200,
            message: "Success on login.",
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