import { useState, useContext, useEffect, type JSX } from 'react';

import Pendentes from './Pendentes';
import Confirmados from './Confirmados';
import Produtos from './Produtos';
import Live from './Live';
import CriarProduto from './CriarProduto';
import Loading from '../../components/All/Loading';
import { GiHamburgerMenu } from 'react-icons/gi';

import { Context } from '../../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../../Services/Storage';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Estoque from './Estoque';

const Home = () => {

    //CONTEXT
    const { login, setLogin, setConnection, connectionStatus, setConnectionStatus } = useContext(Context)!;

    //ROUTER
    const navigate = useNavigate();

    useEffect(() => {

        if (login == null) {

            setTimeout(() => {
                navigate('/auth');
            }, 2000);

            return;
        }

    }, [login]);

    //********************** ADICIONAR AO CONTEXT *************************/
    const [section, setSection] = useState<string>('live');

    const renderComponente = (): JSX.Element => {
        switch (section) {
            case 'live':
                return <Live />;
            case 'pendentes':
                return <Pendentes />;
            case 'confirmados':
                return <Confirmados />;
            case 'produtos':
                return <Produtos render={setSection} />;
            case 'new':
                return <CriarProduto render={setSection} />;
            case 'estoque':
                return <Estoque />;
            default:
                return <Live />;
        }
    };

    //****************************************************************** */

    return (
        <>
            {login ? (
                <>
                    <header
                        className="w-full h-[10vh] gap-5 py-4 flex justify-center items-center px-[5%] mb-4 bg-[rgb(48,62,83)]
                        lg:px-[20%] xl:justify-between "
                    >
                        <GiHamburgerMenu className="text-4xl text-white" />

                        <ul className="flex items-center">
                            <li
                                onClick={() => setSection('live')}
                                className="ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b-4 hover:border-red-500 hover:text-red-500"
                            >
                                Live
                            </li>

                            <li
                                onClick={() => setSection('pendentes')}
                                className="hidden md:block ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b-4  hover:border-red-500 hover:text-red-500"
                            >
                                Pendentes
                            </li>

                            <li
                                onClick={() => setSection('confirmados')}
                                className="hidden md:block ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b-4  hover:border-red-500 hover:text-red-500"
                            >
                                Confirmados
                            </li>

                            <li
                                onClick={() => setSection('produtos')}
                                className="ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b-4  hover:border-red-500 hover:text-red-500"
                            >
                                Produtos
                            </li>

                            <li
                                onClick={() => setSection('estoque')}
                                className="ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b-4  hover:border-red-500 hover:text-red-500"
                            >
                                Estoque
                            </li>
                        </ul>

                        <div className="flex h-full gap-4 rounded-2xl justify-center items-center">
                            <h3 className="text-white font-bold text-[0.8rem] hidden">{login?.nome}</h3>

                            <div className="flex gap-2">
                                <h4 className="font-light font-sans text-white hidden lg:block">
                                    {connectionStatus
                                        ? 'Online'
                                        : connectionStatus == false
                                          ? 'Offline'
                                          : 'Conectando...'}
                                </h4>

                                <div
                                    className={`w-[25px] h-[25px] rounded-full border border-white
                                ${connectionStatus ? 'bg-green-600' : connectionStatus == false ? 'bg-red-600' : 'bg-yellow-600'}`}
                                ></div>
                            </div>

                            <button
                                className=""
                                onClick={() => {
                                    setLogin((prev) => {
                                        deleteToken();
                                        return null;
                                    });
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </header>

                    <div
                        className="h-full lg:h-[85vh] w-[95%] lg:w-[90%] 2xl:w-[80%] overflow-y-scroll lg:overflow-y-hidden
                        flex justify-center items-start"
                    >
                        {renderComponente()}
                    </div>
                </>
            ) : (
                <Loading />
            )}
        </>
    );
};

export default Home;
