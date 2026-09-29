import { useState, createContext, useEffect, useRef } from 'react';
import type { PropsWithChildren, RefObject, SetStateAction } from 'react'; //TIPAGEM PROP
import type { Product, User } from '../Types/Types';
import { HubConnectionBuilder, type HubConnection } from '@microsoft/signalr';
import somPedido from '../assets/meme-fail-alert-locran-1-00-01.mp3';
import { getToken } from '../Services/Storage';

export type ContextType = {
    login: User | null;
    setLogin: React.Dispatch<React.SetStateAction<User | null>>;
    contato: string;
    setContato: React.Dispatch<React.SetStateAction<string>>;
    notify: Array<Record<string, any>> | null;
    setNotify: React.Dispatch<SetStateAction<Array<Record<string, any>> | null>>;
    connection: HubConnection | null;
    setConnection: React.Dispatch<SetStateAction<HubConnection | null>>;
    connectionStatus: boolean | null;
    setConnectionStatus: React.Dispatch<SetStateAction<boolean | null>>;
    online: boolean;
    setOnline: React.Dispatch<SetStateAction<boolean>>;
    ativarSom: () => void;
    audioRef: RefObject<HTMLAudioElement | null>;
    entrarNaSala: () => Promise<void>;
    background: string;
    setBackground: React.Dispatch<React.SetStateAction<string>>;
    backgroundSecond: string;
    setBackgroundSecond: React.Dispatch<React.SetStateAction<string>>;
    produtosList: Array<Product> | null;
    setProdutosList: React.Dispatch<React.SetStateAction<Array<Product> | null>>;
    render: boolean;
    setRender: React.Dispatch<React.SetStateAction<boolean>>;
};


export const Context: React.Context<ContextType | null> = createContext<ContextType | null>(null);

/************************************************************************************** */

export const ContextProvider = ({ children }: PropsWithChildren) => {
    const [contato, setContato] = useState<string>('');
    const [notify, setNotify] = useState<Array<Record<string, any>> | null>(null);
    const [login, setLogin] = useState<User | null>(null);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
    const [online, setOnline] = useState<boolean>(false);
    const loginRef = useRef<User | null>(null);
    const [background, setBackground] = useState<string>('#2a2342');
    const [backgroundSecond, setBackgroundSecond] = useState<string>('#422f80');
    const [produtosList, setProdutosList] = useState<Array<Product> | null>(null);
    const [render, setRender] = useState<boolean>(true);
    //#2a2342
    //#60a7a7
    //#422f80
    //#69a87e

    //******* */
    const [somAtivado, setSomAtivado] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    //*****HORA ******/
    const agora = new Date();

    const hora = Number(
        new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            hour: 'numeric',
            hour12: false,
        }).format(agora)
    );

    const entrarNaSala = async (conn?: HubConnection) => {
        const conexao = conn ?? connection;

        if (!conexao) {
            console.log('❌ Conexão não disponível');
            return;
        }

        if (conexao.state !== 'Connected') {
            console.log('❌ SignalR não está conectado:', conexao.state);
            return;
        }

        const usuario = loginRef.current;

        if (!usuario?.user) {
            console.log('❌ Login não disponível');
            return;
        }

        if (online) {
            await conexao.invoke('SairSala', usuario.user);

            setOnline(false);

            return;
        }

        if (hora >= 8 && hora < 24) {
            await conexao.invoke(
                'EntrarSala',
                JSON.stringify({
                    sala: usuario.user,
                    chaveAcesso: 'delivery1234',
                })
            );

            console.log('✅ Solicitação para entrar na sala enviada');
        } else {
            console.log('⏰ Fora do horário permitido');
        }
    };

    const ativarSom = async () => {
        try {
            const audio = new Audio(somPedido);
            audio.volume = 1;

            // força carregamento
            await audio.load();

            // desbloqueia autoplay
            await audio.play();

            // pausa imediatamente
            audio.pause();

            audio.currentTime = 0;

            audioRef.current = audio;

            setSomAtivado(true);

            console.log('✅ Som ativado');
        } catch (err) {
            console.error('Erro:', err);
        }
    };

    useEffect(() => {
        if (connection) return;

        console.log('Conexão declarada.');

        const newConnection = new HubConnectionBuilder()
            .withUrl('https://dotnet-webapi-base-production.up.railway.app/chat')
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .build();

        newConnection.serverTimeoutInMilliseconds = 90000;
        newConnection.keepAliveIntervalInMilliseconds = 30000;

        newConnection.onclose(async (error) => {
            console.error('🔴 DESCONNECTED:', error);

            if (newConnection.state !== 'Disconnected') {
                await newConnection.stop();
            }

            setConnectionStatus(false);
            setOnline(false);
        });

        newConnection.onreconnecting((error) => {
            console.warn('🟡 RECONNECTING:', error);

            setConnectionStatus(null);
            setOnline(false);
        });

        newConnection.onreconnected(async (connectionId) => {
            console.log('🟢 RECONNECTED:', connectionId);
            setConnectionStatus(true);
            await entrarNaSala(newConnection);
        });

        newConnection.on('Erro', async (mensagem: string) => {
            console.error('❌ Servidor:', mensagem);
            setOnline(false);
        });

        newConnection.on('Conectado', (msg: string) => {
            console.log(msg);
            setOnline(true);
        });

        setConnection(newConnection);
    }, []);

    useEffect(() => {

        loginRef.current = login;

    }, [login]);


    //produtos
    useEffect(() => {

        const getProducts = async () => {
            const token = await getToken();
            const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/Produtos', {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            });

            const data = await res.json();
            setProdutosList(data);
        };

        getProducts();

    }, [render, login]);


    //background
    useEffect(() => {
        document.documentElement.style.setProperty('--cor-primaria', background);
        document.documentElement.style.setProperty('--cor-secundaria', backgroundSecond);
    }, [background, backgroundSecond]);

    return (
        <Context.Provider
            value={{
                login,
                setLogin,
                contato,
                setContato,
                notify,
                setNotify,
                connection,
                setConnection,
                connectionStatus,
                setConnectionStatus,
                online,
                setOnline,
                ativarSom,
                audioRef,
                entrarNaSala,
                background,
                setBackground,
                backgroundSecond,
                setBackgroundSecond,
                produtosList,
                setProdutosList,
                render,
                setRender
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;
