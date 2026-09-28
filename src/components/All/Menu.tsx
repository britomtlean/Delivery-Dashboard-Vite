import { useState } from 'react';
import './Menu.css';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function MenuLateral() {
    const [aberto, setAberto] = useState<boolean>(false);

    return (
        <>
            {/* Botão de abrir */}
            <button className="botao-menu bg-neutral-50/0! border-none!" onClick={() => setAberto(true)}>
                <GiHamburgerMenu className="" style={{ fontSize: '2rem' }} />
            </button>

            {/* Overlay escuro (fecha o menu ao clicar) */}
            {aberto && <div className="overlay" onClick={() => setAberto(false)}></div>}

            {/* Menu lateral */}
            <div className={`menu-lateral ${aberto ? 'ativo' : ''}`}>
                <div className="menu-header">
                    <button className="fechar border-none!" onClick={() => setAberto(false)}>
                        <span className='text-4xl!'>×</span>
                    </button>
                </div>

                <ul>
                    <li
                        onClick={() => {}}
                        className="list-none text-center cursor-pointer text-lg! font-bold! text-[#ccc] transition-all hover:border-4"
                    >
                        Live
                    </li>

                    <li
                        onClick={() => {}}
                        className="list-none text-center cursor-pointer text-lg! font-bold! text-[#ccc] transition-all hover:border-4"
                    >
                        Pendentes
                    </li>

                    <li
                        onClick={() => {}}
                        className="list-none text-center cursor-pointer text-lg! font-bold! text-[#ccc] transition-all hover:border-4"
                    >
                        Confirmados
                    </li>

                    <li
                        onClick={() => {}}
                        className="list-none text-center cursor-pointer text-lg! font-bold! text-[#ccc] transition-all hover:border-4"
                    >
                        Produtos
                    </li>

                    <li
                        onClick={() => {}}
                        className="list-none text-center cursor-pointer text-lg! font-bold! text-[#ccc] transition-all hover:border-4"
                    >
                        Estoque
                    </li>

                    <li
                        onClick={() => {}}
                        className="list-none text-center cursor-pointer text-lg! font-bold! text-[#ccc] transition-all hover:border-4"
                    >
                        Categorias
                    </li>

                    <li
                        onClick={() => {}}
                        className="list-none text-center cursor-pointer text-lg! font-bold! text-[#ccc] transition-all hover:border-4"
                    >
                        Perfil
                    </li>
                </ul>
            </div>
        </>
    );
}
