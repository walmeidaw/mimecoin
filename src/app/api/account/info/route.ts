import { UserAuth } from "@/lib/auth/token";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest){
    let auth : any = null;

    try {
        auth = await UserAuth( request );
    } catch ( error : any ) {
        return NextResponse.json({
            status: 401,
            message : error.message,
            timestamp: new Date().getTime()
        },{ status : 401 })
    }

    delete auth.namespace.id;
    delete auth.account.accountPassword;
    delete auth.account.id;
    delete auth.account.idCustomer;
    delete auth.account.customer.id;
    delete auth.account.balance;
    delete auth.account.balanceExtra;
    delete auth.account.status;

    return NextResponse.json({
        data: auth,
        status: 200,
        timestamp: new Date().getTime()
    });
}