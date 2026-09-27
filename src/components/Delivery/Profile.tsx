import React, { useContext, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react';
import { FaUser } from 'react-icons/fa';
import { Context } from '../../context/ContextProvider';
import type { LoginType, User } from '../../Types/Types';
import { getToken } from '../../Services/Storage';
import { AuthData } from '../../Data/AuthData';

const Profile = () => {
    //CONTEXT *************************************************************
    const { login, setLogin, setBackground, setBackgroundSecond } = useContext(Context)!;

    //REFS ****************************************************************
    const nameRef = useRef<HTMLInputElement>(null);
    const descricaoRef = useRef<HTMLInputElement>(null);
    const horarioRef = useRef<HTMLInputElement>(null);
    const enderecoRef = useRef<HTMLInputElement>(null);
    const instagramRef = useRef<HTMLInputElement>(null);
    const whatsappRef = useRef<HTMLInputElement>(null);
    const backgroundRef = useRef<HTMLInputElement>(null);
    const backgroundSecondRef = useRef<HTMLInputElement>(null);

    const editRef = useRef<HTMLButtonElement>(null);
    const saveRef = useRef<HTMLButtonElement>(null);

    //REFS ****************************************************************

    const [whatsapp, setWhatsapp] = useState<string>();
    const [instagram, setInstagram] = useState<string>();
    const [descricao, setDescricao] = useState<string>();
    const [endereco, setEndereco] = useState<string>();
    const [horario, setHorario] = useState<string>();

    //FUNCTIONS ************************************************************

    function handleEdit() {
        descricaoRef.current!.disabled = false;
        enderecoRef.current!.disabled = false;
        horarioRef.current!.disabled = false;
        whatsappRef.current!.disabled = false;
        instagramRef.current!.disabled = false;
        backgroundRef.current!.disabled = false;
        backgroundSecondRef.current!.disabled = false;

        descricaoRef.current!.style.color = 'black';
        enderecoRef.current!.style.color = 'black';
        horarioRef.current!.style.color = 'black';
        whatsappRef.current!.style.color = 'black';
        instagramRef.current!.style.color = 'black';

        descricaoRef.current!.focus();

        editRef.current!.style.display = 'none';
        saveRef.current!.style.display = 'block';
    }

    async function handleSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        console.log('funcionado');

        //login!.background = backgroundRef.current!.value
        //login!.backgroundSecond = backgroundSecondRef.current!.value;

        descricaoRef.current!.disabled = true;
        enderecoRef.current!.disabled = true;
        horarioRef.current!.disabled = true;
        whatsappRef.current!.disabled = true;
        instagramRef.current!.disabled = true;
        backgroundRef.current!.disabled = true;
        backgroundSecondRef.current!.disabled = true;

        descricaoRef.current!.style.color = '#1d293d';
        enderecoRef.current!.style.color = '#1d293d';
        horarioRef.current!.style.color = '#1d293d';
        whatsappRef.current!.style.color = '#1d293d';
        instagramRef.current!.style.color = '#1d293d';

        saveRef.current!.style.display = 'none';
        editRef.current!.style.display = 'block';

        //Alterar background
        //setBackground(backgroundRef.current!.value);
        //setBackgroundSecond(backgroundSecondRef.current!.value);

        const form = new FormData();
        form.append('Descricao', descricaoRef.current!.value);
        form.append('Endereco', enderecoRef.current!.value);
        form.append('Horario', horarioRef.current!.value);
        form.append('WhatsApp', whatsappRef.current!.value);
        form.append('Instagram', instagramRef.current!.value);
        form.append('Background', backgroundRef.current!.value);
        form.append('BackgroundSecond', backgroundSecondRef.current!.value);

        const token = await getToken();

        const res = await fetch(`https://dotnet-webapi-base-production.up.railway.app/api/usuario/update/`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
            //formdata
            body: form,
        });

        const data = await res.text();

        if (!res.ok) {
            console.log(data);
            return;
        }

        await AuthData.getProfile(JSON.parse(token),'https://dotnet-webapi-base-production.up.railway.app/api/usuario/profile').then((data) => {setLogin(data);})
    }

    /******************************************************************** */

    //EFFECT **************************************************************/

    useEffect(() => {
        console.log('Componente UpdateProfile Renderizou');

        if (editRef.current) editRef.current.style.display = 'block';
        if (saveRef.current) saveRef.current.style.display = 'none';
    }, [login]);

    /******************************************************************** */

    return (
        <div
            className="w-full h-full rounded-lg
            flex flex-col justify-start items-center gap-4"
        >
            <div>
                <FaUser className="text-5xl!" />
            </div>

            <form
                className="w-full p-8 text-center border border-slate-300 rounded-lg
                flex flex-col justify-center items-center gap-4
                lg:w-3/8 md:text-2xl text-slate-800"
                onSubmit={(e) => {
                    handleSave(e);
                }}
            >
                <div className="w-full flex justify-between gap-4">
                    <input
                        className="border w-full border-white bg-gray-100 text-center rounded-[10px] p-2 py-4! focus:outline-blue-500 focus:outline-1
                    md:w-full"
                        type="text"
                        defaultValue={login?.nome}
                        ref={nameRef}
                        disabled={true}
                    />
                    <input
                        className="border w-full border-white bg-gray-100 text-center rounded-[10px] p-2 py-4! focus:outline-blue-500 focus:outline-1
                    md:w-full"
                        type="text"
                        placeholder="Insira uma descrição"
                        defaultValue={login?.descricao}
                        ref={descricaoRef}
                        onChange={(e) => {
                            descricaoRef.current!.value = e.target.value;
                            console.log(descricaoRef.current!.value);
                        }}
                        disabled={true}
                        required
                    />
                </div>

                <input
                    className="border w-full border-white bg-gray-100 text-center rounded-[10px] p-2 py-4! focus:outline-blue-500 focus:outline-1
                    md:w-full"
                    type="text"
                    placeholder="Insira um horário"
                    defaultValue={login?.horario}
                    ref={horarioRef}
                    disabled={true}
                    required
                />
                <input
                    className="border w-full border-white bg-gray-100 text-center rounded-[10px] p-2 py-4! focus:outline-blue-500 focus:outline-1
                    md:w-full"
                    type="text"
                    placeholder="Insira um endereço"
                    defaultValue={login?.endereco}
                    ref={enderecoRef}
                    disabled={true}
                    required
                />
                <input
                    className="border w-full border-white bg-gray-100 text-center rounded-[10px] p-2 py-4! focus:outline-blue-500 focus:outline-1
                    md:w-full"
                    type="text"
                    placeholder="Insira o WhatsApp"
                    defaultValue={login?.whatsApp}
                    ref={whatsappRef}
                    onChange={(e) => {
                        whatsappRef.current!.value = e.target.value;
                        console.log(whatsappRef.current!.value);
                    }}
                    disabled={true}
                    required
                />
                <input
                    className="border w-full border-white bg-gray-100 text-center rounded-[10px] p-2 py-4! focus:outline-blue-500 focus:outline-1
                    md:w-full"
                    type="text"
                    placeholder="Insira o Instagram"
                    defaultValue={login?.instagram}
                    ref={instagramRef}
                    onChange={(e) => {
                        instagramRef.current!.value = e.target.value;
                        console.log(instagramRef.current!.value);
                    }}
                    disabled={true}
                    required
                />

                <div
                    className="w-full h-full
                    flex flex-col items-center justify-start gap-1"
                >
                    <h1 className="text-xl! text-black! font-medium!">Defina a cor de loyout:</h1>
                    <div className="w-full flex gap-4 justify-between">
                        <input
                            className="w-full h-[80px] border border-slate-600 rounded-lg m-2"
                            type="color"
                            defaultValue={login?.background || '#60a7a7'}
                            ref={backgroundRef}
                            onChange={(e) => {
                                backgroundRef.current!.value = e.target.value;
                                console.log(backgroundRef.current!.value);
                            }}
                            disabled={true}
                        />
                        <input
                            className="w-full h-[80px] border border-slate-600 rounded-lg m-2"
                            type="color"
                            defaultValue={login?.backgroundSecond || '#69a87e'}
                            ref={backgroundSecondRef}
                            onChange={(e) => {
                                backgroundSecondRef.current!.value = e.target.value;
                                console.log(backgroundSecondRef.current!.value);
                            }}
                            disabled={true}
                        />
                    </div>
                </div>

                <button
                    className="w-full py-4! text-black!
                    md:w-2/3"
                    ref={editRef}
                    type="button"
                    onClick={handleEdit}
                >
                    Editar
                </button>

                <button
                    className="hidden w-full py-4! text-black! bg-sky-500!
                    md:w-2/3"
                    type="submit"
                    ref={saveRef}
                >
                    Salvar
                </button>
            </form>
        </div>
    );
};

export default Profile
