import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { Context } from '../../context/ContextProvider';

const Profile = () => {
    //CONTEXT *************************************************************
    const { login } = useContext(Context)!;

    //REFS ****************************************************************
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const editRef = useRef<HTMLButtonElement>(null);
    const saveRef = useRef<HTMLInputElement>(null);

    //FUNCTIONS ************************************************************

    const [cor, setCor] = useState('#000000');

    function handleEdit() {
        nameRef.current!.disabled = false;
        nameRef.current!.required = true;
        //nameRef.current!.style.background = '#bbf7d0';
        //nameRef.current!.style.borderColor = 'green';
        nameRef.current!.focus();

        emailRef.current!.disabled = false;
        emailRef.current!.required = true;
        //emailRef.current!.style.background = '#bbf7d0';
        //emailRef.current!.style.borderColor = 'green';

        editRef.current!.style.display = 'none';
        saveRef.current!.style.display = 'block';
    }


    /******************************************************************** */

    //EFFECT **************************************************************/

    useEffect(() => {
        console.log('Componente UpdateProfile Renderizou');

        if (!nameRef.current || !emailRef.current) return;

        nameRef.current.disabled = true;
        nameRef.current.value = '';

        emailRef.current.disabled = true;
        emailRef.current.value = '';

        if (editRef.current) editRef.current.style.display = 'block';
        if (saveRef.current) saveRef.current.style.display = 'none';
    }, [login]);

    /******************************************************************** */

    return (
        <div
            className=" w-full mt-8 min-h-full bg-slate-800/25 flex flex-col justify-start items-center gap-4 rounded-lg py-20 px-5"
        >
            <div>
                <FaUser className="text-5xl!" />
            </div>

            <form
                className="w-full lg:w-3/8 flex flex-col justify-center items-center gap-4 text-center
                md:text-2xl md:p-4 "
                onSubmit={() => {}}
            >
                <input
                    className="border w-full border-white bg-gray-100 text-center rounded-[10px] p-2 py-4! focus:outline-blue-500 focus:outline-1
                    md:w-full"
                    type="text"
                    name="name"
                    placeholder={login?.nome}
                    disabled={true}
                    ref={nameRef}
                />

                <div
                    className="w-full h-full
                    flex flex-col items-center justify-start gap-4"
                >
                    <input
                        className="w-full h-[100px] rounded-lg m-2"
                        type="color"
                        value={cor}
                        onChange={(e) => setCor(e.target.value)}
                    />
                </div>

                <button
                    className="btn-primary w-full py-4!
                    md:w-full"
                    ref={editRef}
                    type="button"
                    onClick={handleEdit}
                >
                    Editar
                </button>

                <input
                    className="hidden btn-primary w-full
                    md:w-2/3"
                    type="submit"
                    value={'Salvar'}
                    ref={saveRef}
                />
            </form>
        </div>
    );
};

export default Profile
