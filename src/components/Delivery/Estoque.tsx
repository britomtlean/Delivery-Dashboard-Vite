import React, { useEffect, useState } from 'react'
import { getToken } from '../../Services/Storage';
import type { Product } from '../../Types/Types';
import { Link } from 'react-router-dom';

const Estoque = () => {

    const [produtos, setProdutos] = useState<Array<Product> | null>(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState<string>('');
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<string>('');
    const [estoque, setEstoque] = useState<string>('entrada');
    const [busca, setBusca] = useState<string>('');
    const [render, setRender] = useState<boolean>(true);


    const getProducts = async () => {
        const token = await getToken();
        const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/Produtos', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        });

        const data = await res.json();

        setProdutos(() => {
            console.log(data);
            return data;
        });
    };

    const entrada = async (id: string, quantidade: string, e: React.ChangeEvent<any>) => {
        e.preventDefault();
        if(!quantidade) return;

        const token = await getToken();
        const form = new FormData();
        form.append('quantidade', quantidade);

        const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/produtos/entrada/' + id, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
            body: form,
        });

        const data = await res.text();

        if (!res.ok) {
            console.log('Erro ao atualizar estoque');
            return;
        }

        console.log(data);
        setRender(!render);
    };

    const saida = async (id: string, quantidade: string, e: React.ChangeEvent<any>) => {
        e.preventDefault();
        if (!quantidade) return;

        const token = await getToken();
        const form = new FormData();
        form.append('quantidade', quantidade);

        const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/produtos/saida/' + id, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
            body: form,
        });

        const data = await res.text();

        if(!res.ok){
            console.log('Erro ao atualizar estoque');
            return;
        }

        console.log(data);
        setRender(!render);
    };

    //////////////////////////// SEARCH //////////////////////////////////

    const dadosFiltrados = produtos?.filter((item) => {
        const texto = busca.toLowerCase();
        return item.nome.toLowerCase().includes(texto) || String(item.valor).includes(texto);
    });

    ////////////////////////////////////////////////////////////////////

    useEffect(() => {
        getProducts();
    }, [render]);

    return (
        <div
            className="w-full h-screen pt-10
            flex flex-col justify-start items-center gap-4"
        >
            <select
                name=""
                id=""
                className="w-1/2 bg-slate-200 p-4 rounded-xl mb-5"
                onChange={(e) => {
                    setEstoque(e.target.value);
                }}
            >
                <option value="entrada">Entrada</option>
                <option value="saida">Saida</option>
            </select>

            <div
                className="w-full h-full flex flex-col justify-center items-center gap-4
                    lg:flex-row lg:items-start"
            >
                <table
                    className="w-7/8 max-h-2/5 p-5
                        row-start-1 row-span-4 col-start-4 col-span-4
                        flex flex-col justify-start items-center
                        font-bold text-left
                        bg-radial from-blue-400/20 to-blue-500/20
                        shadow-xl/10 border border-white/0 rounded-3xl
                        hover:border-[3px] hover:border-[#64ffdd]
                        lg:w-3/5 lg:max-h-[400px] lg:p-7"
                >
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="my-4 px-4 py-2 rounded w-full text-[16px] font-normal shadow bg-sky-200"
                    />

                    <thead className="w-full">
                        <tr className="w-full text-[2rem] grid grid-cols-3 py-2 bg-slate-200 rounded-t-lg px-10 lg:px-8 gap-x-50">
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Estoque</th>
                        </tr>
                    </thead>

                    <tbody className="w-full overflow-y-scroll rounded-b-lg text-[1rem]">
                        {dadosFiltrados?.map((item) => (
                            <tr
                                className="grid grid-rows-2 grid-cols-3 px-10 lg:px-8 gap-x-50
                          w-full py-3 bg-blue-200 border-b border-white
                          font-medium font-sans hover:bg-white "
                                key={item.id}
                                onDoubleClick={() => {
                                    setProdutoSelecionado(item.id!);
                                }}
                            >
                                <>
                                    <td>{item?.id}</td>
                                    <td>{item?.nome}</td>
                                    <td>{item.estoque}</td>
                                </>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div
                    className="w-7/8 h-full flex flex-col items-center justify-start gap-4 p-10
                lg:w-[500px]"
                >
                    {estoque == 'entrada' ? (
                        <h1 className="text-4xl! text-black! font-bold!">Entrada</h1>
                    ) : (
                        <h1 className="text-4xl! text-black! font-bold!">Saída</h1>
                    )}
                    <form
                        onSubmit={(e) => {
                            estoque == 'entrada'
                                ? entrada(produtoSelecionado, quantidadeSelecionada, e)
                                : saida(produtoSelecionado, quantidadeSelecionada, e);
                        }}
                        className="w-full flex justify-between flex-col gap-2"
                    >
                        <input
                            onChange={(e) => {
                                setProdutoSelecionado(e.target.value);
                            }}
                            className="w-full p-5 lg:p-2 bg-gray-200 rounded-xl outline-none!"
                            type="search"
                            placeholder="Insira o ID do produto"
                            value={produtoSelecionado}
                        />
                        <input
                            onChange={(e) => {
                                setQuantidadeSelecionada(() => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    return value;
                                });
                            }}
                            className="w-full p-5 lg:p-2 bg-gray-200 rounded-xl outline-none!"
                            type="search"
                            placeholder="Insira a quantidade"
                            value={quantidadeSelecionada}
                        />
                        <button className='py-5!' type="submit">Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Estoque
