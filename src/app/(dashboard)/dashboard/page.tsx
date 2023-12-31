import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { User } from "@/lib/controller/user";

import { Transactions } from "@/components/transaction";
import { AccountsSqueleton } from "./accounts/accounts.component";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Home({ searchParams } : {  searchParams : { [key: string]: string | string[] | undefined } }) {
  const session = await getServerSession(authOptions);

  if( !session ){
    return redirect('/');
  }

  const user_session : any = session.user;
  const user = await User.get( user_session.id );
  if( !user ){
    return redirect('/');

  }
  const namespaces = await user.getNamespaces();

  if( namespaces.length === 0 ){
    return  <div className="flex-1 w-full flex p-6 flex-col gap-6">
      <div className="flex flex-col flex-1 gap-6">
          <p><Link href="/new/mime" className="bg-primary px-6 py-3 rounded-2xl inline-block transition-background hover:bg-primary-500">Criar um mime</Link> Crie seu primeiro mime.</p>
      </div>
    </div>
  }

  const namespaceIndex = searchParams.namespaceIndex ? parseInt( searchParams.namespaceIndex as string ) : 0 ;

  return (
    <div className="flex-1 w-full flex p-6 flex-col lg:flex-row gap-6 items-stretch">
      <div className="flex flex-col flex-1 gap-6">
        <h2 className="font-bold">Histório de transações</h2>
        <div className="content-list">
          <Suspense fallback={ <AccountsSqueleton /> }>
            <Transactions namespaceIndex={ namespaceIndex } />
          </Suspense>
        </div>
      </div>      
    </div>
  )
}
