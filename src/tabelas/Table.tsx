import React, { useEffect, useState } from 'react'
import { getToken } from '../Services/Storage';
import type { Product } from '../Types/Types';
import { Link } from 'react-router-dom';

const Table = () => {

    const [produtos, setProdutos] = useState<Array<Product> | null>(null);
    const [busca, setBusca] = useState<string>('');

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

    //////////////////////////// SEARCH //////////////////////////////////

    const dadosFiltrados = produtos?.filter((item) => {
        const texto = busca.toLowerCase();
        return (
            item.nome.toLowerCase().includes(texto) ||
            String(item.valor).includes(texto) ||
            item.codigoBarra?.toLowerCase().includes(texto)
        );
    });

    ////////////////////////////////////////////////////////////////////

    useEffect(() => {
        getProducts();
    }, []);

  return (
      <table
          className="w-1/2 h-full max-h-[600px] p-5 lg:p-7
                row-start-1 row-span-4 col-start-4 col-span-4
                flex flex-col justify-start items-center
                font-bold text-center
                bg-radial from-blue-400/20 to-blue-500/20
                shadow-xl/30 border border-white/0 rounded-3xl
                hover:border-[3px] hover:border-[#64ffdd]"
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
                          <Link to={`/produto/${item.id}`} target="_blank" className="hover:cursor-pointer">
                              Editar
                          </Link>
                      </>
                  </tr>
              ))}
          </tbody>
      </table>
  );
}

export default Table
