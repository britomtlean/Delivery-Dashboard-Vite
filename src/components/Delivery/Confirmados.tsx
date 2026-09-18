import { useEffect, useState } from 'react';
import { checkDate } from '../../Services/Date';

interface ProdutoPedido {
    produtoId: string;
    nome: string;
    quantidade: number;
    valorUnitario: number;
    subtotal: number;
}

interface Pedido {
    id: string;
    dataOriginal: string;
    data: string;
    valorTotal: number;
    status: boolean | null;
    nomeCliente: string;
    contatoCliente: string;
    enderecoCliente: string;
    produtos: ProdutoPedido[];
}

export default function Confirmados() {
    const [vendas, setVendas] = useState<Pedido[]>([]);
    const [ultimaLista, setUltimaLista] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const REGISTROS_POR_PAGINA = 5;

    //PADRÃO INPUT PARA DATA LOCAL
    const [dataSelecionada, setDataSelecionada] = useState<string>(
        new Date().toLocaleDateString('sv-SE', {
            timeZone: 'America/Sao_Paulo',
        })
    );

    //PAGES
    const [paginaAtual, setPaginaAtual] = useState<number>(1);

    /************** FETCH **************/

    async function carregarPedidos(): Promise<void> {
        try {
            const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/pedido', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }

            const data = await res.json();
            console.log(data);

            //FORMATAR PEDIDO
            const novosPedidos: Pedido[] = data.map((p: any) => ({
                id: p.id,
                dataOriginal: p.dataPedido,
                data: new Date(p.dataPedido).toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                }),
                valorTotal: p.valorTotal,
                status: p.status,
                nomeCliente: p.nomeCliente,
                contatoCliente: p.contatoCliente,
                enderecoCliente: p.enderecoCliente,
                produtos: p.produtos,
            }));

            const jsonString = JSON.stringify(novosPedidos);

            if (jsonString !== ultimaLista) {
                setVendas(novosPedidos);
                setUltimaLista(jsonString);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    /************** EFFECT **************/

    useEffect(() => {
        carregarPedidos();

        const interval = setInterval(() => {
            carregarPedidos();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    /************** FILTRO **************/

    const vendasFiltradas = vendas.filter((v) => {
        const dataFiltrada = checkDate(dataSelecionada, v.dataOriginal);

        return (!dataSelecionada || dataFiltrada) && v.status == true;
    });

    /************** PAGINAÇÃO **************/

    const totalPaginas = Math.ceil(vendasFiltradas.length / REGISTROS_POR_PAGINA);

    const inicio = (paginaAtual - 1) * REGISTROS_POR_PAGINA;
    const fim = inicio + REGISTROS_POR_PAGINA;

    const vendasPaginadas = vendasFiltradas.slice(inicio, fim);

    const totalPedidos = vendasFiltradas.reduce((acumulador, item) => {
        return acumulador + item.valorTotal;
    }, 0);

    /************** RENDER **************/

    if (loading) {
        return <div className="flex items-center justify-center p-10 text-2xl font-bold text-white">Carregando...</div>;
    }

    return (
        <div className="flex w-full h-full flex-col items-center gap-5 p-10 text-white overflow-hidden">
            <h1 className="text-4xl font-bold">Gerenciamento de Vendas</h1>

            <div className="flex items-center gap-3">
                <input
                    type="date"
                    value={dataSelecionada}
                    onChange={(e) => {
                        setDataSelecionada(e.target.value);
                        setPaginaAtual(1);
                    }}
                    className="rounded-lg border border-gray-500 bg-gray-700 px-4 py-2 outline-none"
                />

                <button
                    onClick={() => {
                        setDataSelecionada('');
                        setPaginaAtual(1);
                    }}
                    className="rounded-lg bg-red-500 px-5 py-2 font-bold transition hover:bg-red-600"
                >
                    Limpar Filtro
                </button>
            </div>

            {vendasFiltradas.length === 0 ? (
                <div className="mt-10 text-2xl font-bold">Nenhuma venda encontrada</div>
            ) : (
                <>
                    <div className="overflow-auto w-full rounded-xl border border-gray-600 bg-gray-900 shadow-2xl h-[800px] lg:h-[500px] lg:overflow-x-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr className="w-full">
                                    <th className="px-6 py-4 text-center">ID</th>
                                    <th className="px-6 py-4 text-center">Cliente</th>
                                    <th className="px-6 py-4 text-center">Contato</th>
                                    <th className="px-6 py-4 text-center">Valor</th>
                                    <th className="px-6 py-4 text-cener">Data</th>
                                    <th className="px-6 py-4 text-center">Ações</th>
                                    <th className="px-6 py-4 text-center">Status Loja</th>
                                </tr>
                            </thead>

                            <tbody className="w-full overflow-y-scroll border-red-600">
                                {vendasPaginadas.reverse().map((row) => (
                                    <tr key={row.id} className="border-t border-gray-700">
                                        <td className="px-6 py-4">{row.id}</td>

                                        <td className="px-6 py-4">{row.nomeCliente}</td>

                                        <td className="px-6 py-4">{row.contatoCliente}</td>

                                        <td className="px-6 py-4">
                                            {row.valorTotal.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </td>

                                        <td className="px-6 py-4">{row.data}</td>

                                        <td className="px-6 py-4">
                                            <a
                                                className="underline-offset-1"
                                                target="_blank"
                                                href={`https://servidor-sistema-vendas.up.railway.app/PDF/venda_${row.id}.pdf`}
                                            >
                                                Detalhes
                                            </a>
                                        </td>

                                        <td className="px-6 py-4">
                                            {row.status === true ? (
                                                <span className="font-bold text-green-400">Cofirmado</span>
                                            ) : (
                                                <span className="font-bold text-yellow-400">Pendente</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={paginaAtual === 1}
                            onClick={() => setPaginaAtual((prev) => prev - 1)}
                            className="rounded-lg bg-gray-700 px-5 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-80"
                        >
                            Anterior
                        </button>

                        <span className="text-xl font-bold">
                            Página {paginaAtual} de {totalPaginas}
                        </span>

                        <button
                            disabled={paginaAtual === totalPaginas}
                            onClick={() => setPaginaAtual((prev) => prev + 1)}
                            className="rounded-lg bg-gray-700 px-5 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-80"
                        >
                            Próxima
                        </button>
                    </div>

                    <div className="rounded-xl bg-gray-700/60 px-8 py-4 text-4xl font-bold shadow-lg backdrop-blur-md">
                        Total:{' '}
                        {totalPedidos.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
