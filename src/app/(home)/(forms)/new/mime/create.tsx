"use client";

import { useEffect, useState } from "react";
import { CheckCode, CreateNamespace } from "./action";
import { redirect } from "next/navigation";

export default function CreateMime(){
    const [mime,setMime] = useState<{
        precision: 0 | 2 | null,
        name: string,
        code: string
    }>({ precision: null, name: "", code: "" });

    const [ loadingCode, setLoadingCode ] = useState< boolean >(false);
    const [ loading, setLoading ] = useState< boolean >(false);
    const [ error, setError ] = useState< string | null >( null );

    const [codeValid,setCodeValid] = useState<Boolean | null>( null );
    const [readyToSend,setReady] = useState( false );

    function handleChange(event: React.ChangeEvent<HTMLInputElement>){
        const _value = event.target.value;
        const _name = event.target.name;
        setMime({ ...mime, [_name]: _value })
    }

    useEffect(()=>{
        if( mime.code.length === 3 ){
            handleCheckCode()
        }
        checkReady();
    },[ mime, codeValid ])

    function checkReady(){
        if( mime.precision != null && mime.name?.length > 3 && codeValid ){
            setReady(true);
        }else{
            setReady(false);
        }
    }

    async function handleCheckCode(){
        setLoadingCode( true );
        const has = await CheckCode( mime.code );
        setCodeValid( !has );
        if( has ){
            setError("Código do mime já está em uso.")
        }else{
            setError( null )
        }
        setLoadingCode( false );
    }

    async function handleSubmit( formdata : FormData ){
        setLoading( true )

        setError( '' );

        const result : {
            id?: string,
            code?: string,
            name?: string,
            precision?: number,
            error?: any
        } = await CreateNamespace( formdata );

        if( !result || result?.error ){
            setError("Algo deu errado na criação do seu mime.")
        }else{
            gtag('event', "mime_created", result )
            redirect('/dashboard');
        }

        setLoading( false )
    }

    const icon_waiting = <div className="h-8 w-8 flex flex-row items-center justify-center"><span className="animate-pulse rounded-full bg-warning w-2 h-2"></span></div>;
    const icon_ready = <div className="h-8 w-8 flex flex-row items-center justify-center text-success"><span className="material-icon bold">done</span></div>
    const icon_error = <div className="h-8 w-8 flex flex-row items-center justify-center text-danger"><span className="material-icon bold animate-ping">error</span></div>

    return <form action={ handleSubmit } onSubmit={ () => setLoading( true ) } className="flex-1 flex flex-col bg-white rounded-[2rem] overflow-clip">
        <div className="flex flex-col p-8 gap-4">
            <div className="flex flex-col gap-6 items-center">
                <h2 className="text-[2rem] font-black uppercase">Novo Mime</h2>
            </div>
            <div className="flex flex-col gap-2">
                <div className="font-semibold">Tipo de Mime</div>
                <div className=" flex flex-row justify-stretch gap-6">
                    <div className="flex-1 flex">
                        <input onChange={ handleChange } name="precision" type="radio" className="hidden peer" required id="precision-points" value="0" />
                        <label htmlFor="precision-points" className="peer-checked:border-primary-500 peer-checked:bg-primary flex flex-row p-6 rounded-[12px] border-1 gap-3 cursor-pointer hover:bg-primary-300 hover:border-primary-400" tabIndex={1}>
                            <div className="h-12 w-12 flex items-center justify-center bg-white rounded-full">
                                <span className="material-icon text-[2rem] text-primary">finance_chip</span>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <div className="font-bold">Modo pontos</div>
                                <div className="">Ideal para pontos de fidelidade e outros sistemas onde não serão usadas casas decimais.</div>
                            </div>
                        </label>
                    </div>
                    <div className="flex-1 flex">
                        <input onChange={ handleChange } name="precision" type="radio" className="hidden peer" required id="precision-currency" value="2" />
                        <label htmlFor="precision-currency" className="peer-checked:border-primary-500 peer-checked:bg-primary flex flex-row p-6 rounded-[12px] border-1 gap-3 cursor-pointer hover:bg-primary-300 hover:border-primary-400" tabIndex={-1}>
                            <div className="h-12 w-12 flex items-center justify-center bg-white rounded-full">
                                <span className="material-icon text-[2rem] text-primary">money</span>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <div className="font-bold">Modo moeda</div>
                                <div className="">Ideal para sistemas mais complexos como sistemas economicos privados.</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <div className="font-semibold">Nome do Mime</div>
                    <div className="flex flex-col gap-2">
                        <input onChange={ handleChange } autoComplete="off" name="name" className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary" />
                        <span className="text-[0.6rem] font-light">O nome pode ser alterado futuramente.</span>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <div className="font-semibold">Código do Mime</div>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row relative">
                            <input onChange={ handleChange } autoComplete="off" name="code" className="bg-white w-full border py-2 px-3 rounded-[12px] outline-none focus:outline-2 focus:outline-secondary lowercase" maxLength={3} minLength={3} />
                            { loadingCode && <div className="absolute right-1 top-[50%] translate-y-[-50%] flex h-[2rem] w-[2rem] items-center justify-center bg-primary-500 rounded-[2rem]"><span className="material-icon text-2xl animate-spin">progress_activity</span></div> }
                            { codeValid && <div className="absolute right-1 top-[50%] translate-y-[-50%] flex h-[2rem] w-[2rem] items-center justify-center rounded-[2rem] bg-success"><span className="material-icon text-2xl">done</span></div> }
                            { codeValid == false && <div className="absolute right-1 top-[50%] translate-y-[-50%] flex h-[2rem] w-[2rem] items-center justify-center rounded-[2rem] bg-danger"><span className="material-icon text-2xl">error</span></div> }
                        </div>
                        <span className="text-[0.6rem] font-light">O código não pode ser alterado futuramente e deve ser único.</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex-1 p-8 text-lg flex flex-col gap-4">
            { error && <div className="bg-danger p-3 text-white">{ error }</div> }
            <ul className="p-0">
                <li className="flex flex-row gap-2">
                    { mime.precision != null ? icon_ready : icon_waiting } Escolher tipo do mime
                </li>
                <li className="flex flex-row gap-2">
                    { mime.name?.length > 3 ? icon_ready : icon_waiting } Escolher um nome
                </li>
                <li className="flex flex-row gap-2">
                    { codeValid == null ? icon_waiting : codeValid ? icon_ready : icon_error } Escolher um código único
                </li>
                <li className={ `flex flex-row transition-opacity gap-2 ${ readyToSend ? 'opacity-100' : 'opacity-0' }` }>
                    <div className="h-8 w-8 flex flex-row items-center rounded-[2rem] justify-center bg-success"><span className="material-icon">done</span></div> Tudo pronto!   
                </li>
            </ul>
        </div>
        <div className="bg-primary flex flex-row justify-end rounded-[2rem] m-2 h-[4rem]">
            { loading && <div className="flex h-[4rem] w-[4rem] items-center justify-center bg-primary-500 rounded-[2rem]"><span className="material-icon text-2xl animate-spin">progress_activity</span></div> }
            { readyToSend && !loading  &&  <button className="h-[4rem] rounded-[2rem] flex items-center justify-center gap-2 py-2 pl-6  pr-3 hover:bg-primary-500 uppercase">Criar Mime <span className="material-icon text-xl">arrow_forward</span></button>}
        </div>
    </form>
}