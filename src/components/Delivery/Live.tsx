import { useEffect, useState, useRef, useContext } from 'react';
import { Context } from '../../context/ContextProvider';
import somPedido from '../../assets/meme-fail-alert-locran-1-00-01.mp3';

declare global {
    interface Window {
        audioCtx: AudioContext;
        audio: HTMLAudioElement;
    }
}

export default function Live() {

    //CONTEXT
    const { notify, setNotify, connection, setConnection, connectionStatus, setConnectionStatus, online, setOnline, ativarSom, audioRef } = useContext(Context)!;


    const agora = new Date();

    const hora = Number(
        new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            hour: 'numeric',
            hour12: false,
        }).format(agora)
    );

    /////////////////////// AUDIO \\\\\\\\\\\\\\\\\\\\\\\\\\\

    const tocarSom = async () => {
        try {
            
            if (!audioRef.current) return;

            audioRef.current.currentTime = 0;

            await audioRef.current.play();

            console.log('🔊 Tocando');
        } catch (err) {
            console.error('Erro ao tocar:', err);
        }
    };

    //////////////////// FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\

    const notification = async () => {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('Permissão concedida');
        }
    };

    const entrarNaSala = async () => {

        console.log(connection?.state);

        if (!connection) return;

        //AJUSTAR
        if (connection.state === 'Disconnected') {
            alert('Conexão indisponível');
            return;
        }

        if(online){
            await connection.invoke('SairSala', 'loja');
            setOnline(false);
            return
        }

        await connection.invoke('EntrarSala', JSON.stringify({ sala: 'loja', chaveAcesso: 'delivery1234' }));

        //////////////////////////////////////////////
    };

    const enable = async () => {

        try {

            notification();

            await entrarNaSala();

        } catch (err) {
            console.error('Erro:', err);
        }
    };

    ///////////////////////////////////////////////////////////

    /////////////////////////// ACTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    const confirmOrder = async (id: string) => {
        try {
            const res = await fetch(`https://dotnet-webapi-base-production.up.railway.app/api/pedido/confirmar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.text();

            if (!res.ok) {
                throw new Error(data);
            }

            console.log(data);

            setNotify((): any => {
                const atualizarPedidos = notify?.filter((array) => array.id != id);
                return atualizarPedidos;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const cancelOrder = async (id: string) => {
        try {
            const res = await fetch(`https://dotnet-webapi-base-production.up.railway.app/api/pedido/cancelar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.text();

            if (!res.ok) {
                throw new Error(data);
            }

            console.log(data);

            setNotify((): any => {
                const atualizarPedidos = notify?.filter((array) => array.id != id);
                return atualizarPedidos;
            });
        } catch (err) {
            console.error(err);
        }
    };
    ///////////////////////////////////////////////////////////

    useEffect(() => {

        const conectar = async () => {

            if (!connection) return;

            /////////////// FUNCTIONS \\\\\\\\\\\\\\\\\

            const onReceiveMessage = (message: any, sala: string) => {
                console.log('📩 Servidor - ', message);
                tocarSom();

                setNotify((prev) => {
                    if (prev == null) {
                        return [message];
                    }
                    const arrayPedidos = [message, ...prev!];
                    console.log('Pedidos recentes:', arrayPedidos);
                    return arrayPedidos;
                });
            };

            //////////////////////////////////////////////

            //////////////// LISTENERS \\\\\\\\\\\\\\\\\


            connection?.off('ReceiveMessage');

            connection.on('ReceiveMessage', onReceiveMessage);

            /////////////////////////////////////////////////////

            ///////////////////////////////////////////////////

            if (connection?.state === 'Connected') return;

            connection
                ?.start()
                .then(() => {
                    setConnectionStatus(true);


                    if (hora >= 8 && hora <24) {
                        entrarNaSala();
                        console.log('Horário válido!');
                    } else {
                        console.log('Fora do horário permitido.');
                    }


                    console.log('Status: Conectado.')
                })
                .catch(() => {
                    setConnectionStatus(false);
                    alert("Erro ao realizar conexção")
                });
            }

            conectar();

            return () => {
                //...
            }

    },[connection])


    useEffect(() => {

        const verificarConexao = async () => {
            console.log('Verificando conexão...');

            if (connection?.state === 'Connected') return;

            console.log('Conectando...');

            await connection?.start().then(() => {
                setConnectionStatus(true);
                    if (hora >= 8 && hora < 23) {
                        entrarNaSala();
                        console.log('Horário válido!');
                    } else {
                        console.log('Fora do horário permitido.');
                    }
            });
        };

        //verificarConexao();

        const intervalo = setInterval(() => {
            if (connection?.state === 'Connected') {
                console.log('Conectado ao SignalR.');
                clearInterval(intervalo);
                return;
            }

            console.log('Desconectado. Recuperando conexão');
            verificarConexao();
        }, 15000);

            return () => {
                clearInterval(intervalo);
            };

    }, [navigator.onLine]);

    return (
        <div className="h-full w-full overflow-hidden flex flex-col items-center">
            <>
                <div className="flex w-1/2 justify-center gap-4">
                    <button
                        className={`mb-15 rounded-lg bg-red-500! px-4 py-2 text-base font-bold text-white active:scale-95
                        `}
                        onClick={enable}
                    >
                        {online ? 'Desconectar' : 'Conectar'}
                    </button>

                    <button
                        className={`mb-15 rounded-lg bg-blue-500! px-4 py-2 text-base font-bold text-white active:scale-95
                        `}
                        onClick={ativarSom}
                    >
                        Ativar som
                    </button>
                </div>

                <section className="flex w-[90%] flex-col items-center">
                    <h1
                        className="
                                text-3xl
                                font-extrabold!
                                animate-[led_8s_linear_infinite]
                            "
                    >
                        LIVE
                    </h1>

                    <div
                        id="mensagens"
                        className="mt-6 mb-6 flex h-[48vh] w-full lg:w-[70%] flex-col gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-200/40 p-10 py-8 shadow-lg backdrop-blur-md"
                    >
                        {(notify ?? []).map((pedido) => (
                            <div
                                key={pedido.id}
                                className="rounded-xl border border-white/10 bg-[rgb(48,83,83)]/30 p-4 transition-all duration-200 hover:bg-black/30"
                            >
                                {/* Header */}
                                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                                    <h2 className="text-sm font-semibold text-black">Pedido #{pedido.id}</h2>

                                    <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-green-300">
                                        Novo
                                    </span>
                                </div>

                                {/* Produtos */}
                                <ul className="flex flex-col gap-2">
                                    {pedido.produtos?.map((produto: any) => (
                                        <li
                                            key={produto.produtoId}
                                            className="flex items-center justify-between rounded-lg bg-white/20  px-3 py-2"
                                        >
                                            <div className="flex flex-col">
                                                <strong className="text-sm text-black">{produto.nome}</strong>

                                                <span className="text-xs text-black-400">
                                                    Qtd: {produto.quantidade}
                                                </span>
                                            </div>

                                            <span className="text-sm font-semibold text-green-300">
                                                R$ {produto.subtotal}
                                            </span>
                                        </li>
                                    ))}
                                    <div
                                        className={`${pedido.status ? 'hidden' : 'flex justify-between items-center gap-24 mt-2 px-8'}`}
                                    >
                                        <button
                                            className="flex-1"
                                            onClick={async () => {
                                                cancelOrder(pedido.id);
                                            }}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            className="flex-1 bg-[rgb(025,168,106)]!"
                                            onClick={async () => confirmOrder(pedido.id)}
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                    <div
                                        className={`${pedido.status == true ? 'flex justify-between items-center gap-24 mt-2 px-8' : 'hidden'}`}
                                    >
                                        <button
                                            className="flex-1"
                                            onClick={() => {
                                                setNotify((): any => {
                                                    const atualizarPedidos = notify?.filter(
                                                        (array) => array.id != pedido.id
                                                    );
                                                    return atualizarPedidos;
                                                });
                                            }}
                                        >
                                            OK
                                        </button>
                                    </div>
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </>
        </div>
    );
}
