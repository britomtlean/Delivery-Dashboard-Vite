import { useState, useEffect, type ReactNode, type Dispatch, type SetStateAction, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';
import { getToken } from '../../Services/Storage';
import type { Product } from '../../Types/Types';
import { Context } from '../../context/ContextProvider';


type Prop = {
    render: Dispatch<SetStateAction<string>>;
};

const Produtos = ({ render }: Prop) => {

     const { produtosList } = useContext(Context)!;

    // PRODUCTS
    const [produtos, setProdutos] = useState<Array<Product> | null>(null);
    const [top3, setTop3] = useState<Array<Product> | null>(null);
    const [firstProduct, setFirstProduct] = useState<Record<string, any> | null>(null);

    const [busca, setBusca] = useState<string>('');

    useEffect(() => {

        maisVendidos(produtosList);

        setProdutos(() => {
            console.log(produtosList);
            return produtosList;
        });

    }, []);

    useEffect(() => {
        if (!produtos) return;

        setFirstProduct(top3?.find((arr, index) => index == 0)!);
    }, [top3]);

    const nextProduct = () => {
        if (!top3) return;

        const first: Product = top3[0];
        const fila: Array<Product> = top3.filter((array, index) => index != 0);
        const newArray: Array<Product> = [...fila, first];

        setTop3(newArray);
    };

    const returnProduct = () => {
        if (!top3) return;

        const last: Product = top3[produtos?.length! - 1];
        const fila: Array<Product> = top3?.filter((array, index) => index != produtos?.length! - 1);
        const newArray: Array<Product> = [last, ...fila];

        setTop3(newArray);
    };

    async function maisVendidos(dataProduto: Product[] | null): Promise<void> {
        try {
            const token = await getToken();
            const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/pedido', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }

            const data = await res.json();

            ///////////////////

            const top3MaisVendidos: Array<Product> = Object.values(
                //Converte em array
                data
                    .flatMap((pedido: any) => pedido.produtos) //Transforma pedido.produtos em um único array

                    .reduce((acc: any, produto: any) => {
                        // Cria um index para cada produto com base no Id e retorna como objeto
                        if (!acc[produto.produtoId]) {
                            acc[produto.produtoId] = {
                                produtoId: produto.produtoId,
                                nome: produto.nome,
                                imagem: dataProduto?.find((array) => array.id == produto.produtoId)?.imagem,
                                descricao: dataProduto?.find((array) => array.id == produto.produtoId)?.descricao,
                                valor: dataProduto?.find((array) => array.id == produto.produtoId)?.valor,
                                quantidadeVendida: 0,
                            };
                        }

                        //Se o index existir incrementa a quantidade no index correspondente
                        acc[produto.produtoId].quantidadeVendida += produto.quantidade;

                        return acc;
                    }, {})
            )

                //Ordena o array
                .sort((a: any, b: any) => b.quantidadeVendida - a.quantidadeVendida)

                //Retornar os 3 primeiros itens
                .slice(0, 3) as Array<Product>;

            const produtosMaisVendidos = produtos?.filter((produto) =>
                top3MaisVendidos.some((item) => item.nome === produto.nome)
            ) as Array<Record<string, any>>;

            console.log('Mais vendidos:');
            console.log(top3MaisVendidos);
            setTop3(top3MaisVendidos);

            //////////////////
        } catch (err) {
            console.error(err);
        }
    }

    //////////////////////////// SEARCH //////////////////////////////////

    const dadosFiltrados = produtosList?.filter((item) => {
        const texto = busca.toLowerCase();
        return item.nome.toLowerCase().includes(texto) || String(item.valor).includes(texto);
    });

    ////////////////////////////////////////////////////////////////////

    return (
        <div
            className="w-full h-full border-t-2 border-white pt-[2%]! pb-[2%]! lg:px-[5%]! border-b-2
            flex flex-col justify-start items-center
            overflow-hidden! lg:p-5 lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-y-5 lg:gap-x-8"
        >
            <div className="w-full h-2/5 lg:h-4/5 lg:w-8/9 row-start-1 row-span-3 col-start-1 col-span-3 lg:relative -top-10">
                <h1
                    className="
                    text-3xl! mb-2!
                    flex justify-center
                    items-center
                    text-white!
                    font-black font-sans!
                    text-center
                "
                >
                    Mais vendidos
                </h1>

                <div
                    className="relative w-full h-4/5
                    flex items-center justify-center
                    "
                >
                    <button
                        onClick={returnProduct}
                        className="lg:absolute left-8 z-10
                        rounded-full h-[3vh] mr-4 bg-cyan-600!
                        text-white backdrop-blur-sm
                        flex items-center justify-center
                        transition-all hover:scale-110
                        lg:min-h-[1.8vw] lg:min-w-[2.5vw]"
                    >
                        <FaAngleLeft className="lg:size-[0.8vw] lg:min-w-[10px] size-6" />
                    </button>

                    <div
                        className="w-4/5 h-full
                        flex flex-col justify-center items-center
                        rounded-3xl
                        bg-white/20 backdrop-blur-md
                        border border-white/30
                        shadow-xl
                        p-4"
                    >
                        {firstProduct == null ? (
                            <span>Carregando...</span>
                        ) : (
                            <>
                                <img
                                    className="max-w-[800%] max-h-[70%]
                                object-contain rounded-2xl
                                transition-transform hover:scale-105"
                                    src={firstProduct.imagem}
                                    alt={firstProduct.nome}
                                />

                                <h2 className="mt-4 text-cyan-300 text-xl! font-black">{firstProduct.nome}</h2>

                                <h2 className="text-white text-xl! font-bold">
                                    {Number(firstProduct.valor).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </h2>
                            </>
                        )}
                    </div>

                    <button
                        onClick={nextProduct}
                        className="lg:absolute right-8 z-10
                        rounded-full h-[3vh] ml-4 bg-cyan-600!
                        text-white backdrop-blur-sm
                        flex items-center justify-center
                        transition-all hover:scale-110
                        lg:min-h-[1.8vw] lg:min-w-[2.5vw]"
                    >
                        <FaAngleRight className="lg:size-[0.8vw] lg:min-w-[10px] size-6" />
                    </button>
                </div>
            </div>

            <div
                className="p-4 lg:py-4! py-6 w-8/9 lg:min-h-4/5 lg:relative -top-10 mb-20! lg:mb-0!
                flex flex-col justify-start items-center gap-2
                col-start-1 col-span-3 row-start-4 row-span-2
                bg-radial from-blue-400/20 to-blue-500/20 shadow-xl/30 border border-white rounded-3xl
                hover:border-[3px] hover:border-[#64ffdd]"
            >
                <h1 className="text-2xl! text-white! font-sans font-bold">Total de vendas:</h1>

                <div
                    className="bg-white/30 w-full text-center rounded-3xl flex justify-center items-center overflow-hidden!
                py-[3.5vh] lg:py-[3.5vw]"
                >
                    <h2 className="text-yellow-400 font-extrabold font-sans text-2xl!">
                        {firstProduct?.quantidadeVendida || 0} Produtos vendidos
                    </h2>
                </div>
            </div>

            <table
                className="w-full h-full max-h-[400px] p-5 lg:p-7
                row-start-1 row-span-4 col-start-4 col-span-4
                flex flex-col justify-start items-center
                font-bold text-center
                bg-radial from-blue-400/20 to-blue-500/20
                shadow-xl/30 border border-white/0 rounded-3xl
                hover:border-[3px] hover:border-[#64ffdd]
                lg:min-h-[400px]"
            >
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="my-4 px-4 py-2 rounded w-full text-[16px] font-normal shadow bg-sky-200"
                />

                <thead className="w-full">
                    <tr className="w-full grid grid-cols-4 py-2 bg-slate-200 rounded-t-lg px-2 lg:px-8">
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Estoque</th>
                        <th>Dados</th>
                    </tr>
                </thead>

                <tbody className="w-full overflow-y-scroll rounded-b-lg">
                    {dadosFiltrados?.map((item) => (
                        <tr
                            className="grid grid-rows-2 grid-cols-4 px-2 lg:px-10
                          w-full py-3 bg-blue-200 border-b border-white
                          font-medium font-sans hover:bg-white "
                            key={item.id}
                        >
                            <>
                                <td>{item?.nome}</td>
                                <td>{item?.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td>{item.estoque}</td>
                                <td>
                                    <Link to={`/produto/${item.id}`} target="_blank" className="hover:cursor-pointer">
                                        Editar
                                    </Link>
                                </td>
                            </>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                className="h-3/5 max-h-[60px] w-full bg-blue-500! py-4! lg:relative lg:top-[95%] hidden lg:block
                col-start-4 col-span-4 row-start-4
                shadow-xl/30 rounded-3xl text-white"
                onClick={() => render('new')}
            >
                Novo Produto
            </button>

            <h1 className="md:hidden">_____</h1>
        </div>
    );
};

export default Produtos;
