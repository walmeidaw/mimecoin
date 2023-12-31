import { Namespace } from '@/lib/controller/namespace';
import moment from 'moment';
import 'moment/locale/pt-br';

export async function NamespaceWidget({ item } : { item : Namespace }) {
    return <div className="p-2 rounded-2xl border-primary border-1 w-full">
        <div className="flex space-x-4 items-center">
            <div className="flex-1 gap-1 flex flex-col sm:flex-row">
                <div className="flex flex-1 gap-2 items-center">
                    <span className="font-mono bg-primary text-primary-foreground py-1 px-3 rounded-3xl">{ item.code }</span>
                    <span className="font-bold gap-3 flex-1">{ item.name }</span>
                </div>
                <div className="flex gap-6 sm:justify-center items-center">
                    <div className="text-[0.6rem] p-1">Criado em <span className="text-secondary">{ moment( item.createdAt ).format('D [de] MMMM [de] YYYY [às] H:mm:ss') }</span></div>
                </div>
            </div>
        </div>
    </div>
}