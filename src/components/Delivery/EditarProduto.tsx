import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../../Types/Types';
import { getToken } from '../../Services/Storage';
import { Context } from '../../context/ContextProvider';

const EditarProduto = () => {

    //ROUTER
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { login } = useContext(Context)!;

    // PRODUCTS
    const [produto, setProduto] = useState<Product | null>(null);

    //DISPLAY
    const [display, setDisplay] = useState<boolean>(false);
    const [nome, setNome] = useState<string>();
    const [desc, setDesc] = useState<string>();
    const [valor, setValor] = useState<string>();

    //Revisar possível bug
    const [disponibilidade, setDisponibilidade] = useState<string>('true');

    //REFS
    const nomeRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const valorRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLInputElement>(null);
    const activeRef = useRef<HTMLInputElement>(null);
    const desativeRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    //ACTIONS

    const displayFunction = () =>
    {

        if (
            !nomeRef.current ||
            !valorRef.current ||
            !statusRef.current ||
            !desativeRef.current ||
            !activeRef.current ||
            !buttonRef.current ||
            !descRef.current
        )
            return;

        descRef.current.disabled = false;
        nomeRef.current.disabled = false;
        valorRef.current.disabled = false;
        activeRef.current.disabled = false;
        desativeRef.current.disabled = false;
        buttonRef.current.disabled = false;

        nomeRef.current.style.border = '2px solid cyan';
        descRef.current.style.border = '2px solid cyan';
        valorRef.current.style.border = '2px solid cyan';

        nomeRef.current.style.outline = 'none';
        descRef.current.style.outline = 'none';
        valorRef.current.style.outline = 'none';

        nomeRef.current.focus()

        setDisplay(true);
    }

    const handleDelete = async () =>
    {

        const confirm = prompt("Digite 'CONFIRMO' para continuar")

        if(confirm != 'CONFIRMO') return

        const token = await getToken();
        const res = await fetch(`https://dotnet-webapi-base-production.up.railway.app/api/Produtos/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        });

        const data = await res.text();

        if(!res.ok)
        {throw Error(data)}

        alert('Produto exluído');
        navigate('/');
    }

    const update = async (e: React.ChangeEvent<any>, id: string) =>
    {

        e.preventDefault();

        const produto = new FormData();

        produto.append('nome', nome!);
        produto.append('login', login?.user!);
        produto.append('descricao', desc!);
        produto.append('valor', valor!);
        produto.append('disponibilidade', disponibilidade!);

        const token = await getToken();
        const res = await fetch(`https://dotnet-webapi-base-production.up.railway.app/api/Produtos/update/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
            //formdata
            body: produto,
        });

        const data = await res.text();

        if (!res.ok) {
            alert(data);
            return
        }

        alert('Produto atualizado com sucesso');

        await getProducts();
        setDisplay(false);
    };

    const getProducts = async () => {

        const token = await getToken();
        const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/Produtos', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        });
        const data = await res.json();

        const produtoFiltred = data.find((array: Product) => array.id == id);
        console.log(produtoFiltred);

        setProduto(() => {
            return produtoFiltred;
        });
    };


    useEffect(() => {
        getProducts();
    }, []);


    return (
        <div
            className="w-[90%] lg:w-[80%] h-full
            flex justify-center items-start"
        >
            <div
                className={`flex justify-start items-center flex-col
                            h-3/4  py-15 mt-2 rounded-lg gap-4 transition-opacity ease-out duration-1000
                            ${display ? 'flex-3 opacity-40' : 'w-[90%] lg:w-[50%]'}`}
            >
                <img className="flex-5 max-w-4/5 max-h-[280px] rounded-3xl" src={`${produto?.imagem}`} alt="" />
                <h2 className="font-bold text-2xl">{produto?.nome}</h2>
                <h2 className="font-bold text-2xl">{produto?.descricao}</h2>
                <h2 className="font-bold text-2xl">
                    {produto?.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h2>
                <h2 className="font-bold text-2xl">{produto?.categoria}</h2>

                <button
                    className="w-3/5 h-1/8 bg-cyan-600! hidden lg:block"
                    onClick={() => {
                        displayFunction();
                    }}
                >
                    Editar
                </button>
                <button
                    onClick={() => {
                        handleDelete();
                    }}
                    className="w-3/5 h-1/8 bg-red-600!"
                >
                    Excluir
                </button>
            </div>

            <div
                className={`flex justify-start items-center flex-col
                            lg:h-[80%] flex-1 py-12 mt-8 rounded-lg gap-4 border transition-all ease-out duration-1000 border-cyan-300

                            ${display ? 'flex flex-5 shadow-xl/30 shadow-[0_0_80px_2px_rgba(100,197,223,0.5)] inset-shadow-sm border-3' : 'hidden boder-1'}`}
            >

                <h1 className="font-bold text-black opacity-100 text-5xl!">Edição</h1>

                <form
                    className="h-full flex-2
                        flex flex-col gap-3 justify-start items-center"
                    onSubmit={(e) => {
                        update(e, produto?.id!);
                    }}
                >
                    <input
                        disabled
                        type="text"
                        name="nome"
                        defaultValue={produto?.nome}
                        ref={nomeRef}
                        className={`bg-white p-4 w-full rounded-lg text-center ${display ? 'opacity-100' : 'opacity-50'}`}
                        onChange={(e) => {
                            setNome(e.target.value);
                        }}
                    />

                    <input
                        type="text"
                        name="descricao"
                        defaultValue={produto?.descricao}
                        ref={descRef}
                        id=""
                        className={`bg-white p-4 w-full rounded-lg text-center ${display ? 'opacity-100' : 'opacity-50'}`}
                        onChange={(e) => {
                            setDesc(e.target.value);
                        }}
                    />

                    <select
                        defaultValue={produto?.categoria || 'Indefinido'}
                        disabled
                        onChange={(e) => {}}
                        className="bg-gray-200 p-4 w-full rounded-lg text-center opacity-50"
                        name=""
                    >
                        <option>{produto?.categoria || 'Indefinido'}</option>
                    </select>

                    <input
                        disabled
                        type="text"
                        name="valor"
                        defaultValue={produto?.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        value={valor}
                        ref={valorRef}
                        className={`bg-white p-4 w-full rounded-lg text-center ${display ? 'opacity-100' : 'opacity-50'}`}
                        onChange={(e) => {
                            setValor(() => {
                                const value = e.target.value.replace(/[^0-9,]/g, '');
                                return value;
                            });
                        }}
                    />

                    <input
                        disabled
                        type="text"
                        name="estoque"
                        id=""
                        value={produto?.estoque?.toString()}
                        className="bg-gray-200 p-4 w-full rounded-lg text-center opacity-50"
                        onChange={(e) => {
                            '';
                        }}
                    />

                    <label className={`w-full flex gap-2 justify-center text-center opacity-50`} htmlFor="">
                        <span>Disponibilidade:</span>
                        <input type="checkbox" ref={statusRef} checked={produto?.disponibilidade} />
                    </label>

                    <div className={`flex gap-4 justify-center ${display ? 'opacity-100' : 'opacity-50'}`}>
                        <label>
                            <input
                                disabled
                                type="radio"
                                name="opcao"
                                ref={activeRef}
                                defaultChecked={true}
                                onChange={(e) => {
                                    setDisponibilidade('true');
                                }}
                            />
                            Disponível
                        </label>

                        <label>
                            <input
                                disabled
                                type="radio"
                                name="opcao"
                                ref={desativeRef}
                                onChange={(e) => {
                                    setDisponibilidade('false');
                                }}
                            />
                            Indisponível
                        </label>
                    </div>

                    <input
                        disabled
                        className="bg-blue-400 p-4 w-full rounded-lg text-center opacity-50"
                        type="file"
                        accept="image/*"
                    />

                    <button
                        disabled
                        className={`bg-cyan-500! px-4 py-5! w-full rounded-lg text-center
                                    ${display ? 'opacity-100' : 'opacity-50'}`}
                        type="submit"
                        ref={buttonRef}
                    >
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditarProduto;
