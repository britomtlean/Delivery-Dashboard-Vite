import { useContext, useState, type Dispatch, type SetStateAction } from 'react'
import { FaBoxOpen } from 'react-icons/fa6';
import { getToken } from '../../Services/Storage';
import { Context } from '../../context/ContextProvider';

type Prop = {
    render: Dispatch<SetStateAction<string>>;
};

const CriarProduto = ({render}: Prop) => {


    const { login } = useContext(Context)!;

    const [nome, setNome ] = useState<string>();
    const [valor, setValor] = useState<string>();
    const [estoque, setEstoque] = useState<string>();
    const [categoria, setCategoria] = useState<string>();
    const [imagem, setImagem] = useState<string>('');
    const [file, setFile] = useState<File | undefined>();


    const createObject = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('nome', nome!);
        formData.append('login', login?.user!);
        formData.append('valor', valor!.replace(',', '.'));
        formData.append('estoque', estoque!);
        formData.append('categoria', categoria!);

        if (file) {
            formData.append('arquivo', file);
        }

        console.log(formData);

        const token = await getToken();
        const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/Produtos', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
            body: formData,
        });

        const data = await res.json();

        console.log(data)
        render("produtos");

    };


  const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFile(()=> {
        setImagem(URL.createObjectURL(e.target.files?.[0]!));
        return e.target.files?.[0];
      });
  };

  return (
      <div
          className="w-full h-full
            flex flex-col justify-start items-center gap-4 p-4"
      >
          <div className="w-full text-center font-black">
              <h1 className="text-black! text-3xl!">Criar Produto</h1>
          </div>

          <div className="w-full h-full flex justify-center pt-4 px-4 gap-10">
              <div className="flex-1">
                  <FaBoxOpen className="w-full text-9xl! text-gray-200" />
              </div>

              <form
                  className="h-full flex-2
              flex flex-col gap-2 justify-start items-center"
                  onSubmit={(e) => {
                      createObject(e);
                  }}
              >
                  <input
                      required
                      type="text"
                      name="nome"
                      id=""
                      placeholder="Digite o nome do produto..."
                      className="bg-gray-200 p-4 w-full rounded-lg text-center"
                      onChange={(e) => {
                          setNome(e.target.value);
                      }}
                  />

                  <input
                      required
                      type="text"
                      name="nome"
                      id=""
                      value={valor}
                      placeholder="Escolha um valor. EX: 19,90"
                      className="bg-gray-200 p-4 w-full rounded-lg text-center"
                      onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9,]/g, '');
                          setValor(value)
                      }}
                  />

                  <input
                      required
                      type="text"
                      name="estoque"
                      id=""
                      value={estoque}
                      placeholder="Insira a quantidade de estoque..."
                      className="bg-gray-200 p-4 w-full rounded-lg text-center"
                      onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setEstoque(value);
                      }}
                  />

                  <select
                      defaultValue={''}
                      required
                      onChange={(e) => {
                          setCategoria(e.target.value);
                      }}
                      className="bg-gray-200 p-4 w-full rounded-lg text-center"
                      name=""
                      id=""
                  >
                      <option disabled value="">
                          Escolha uma categoria
                      </option>
                      <option value="Mais Vendidos">Mais Vendidos</option>
                      <option value="Outros">Outros</option>
                  </select>

                  <input
                      className="bg-blue-400 p-4 w-full rounded-lg text-center"
                      type="file"
                      accept="image/*"
                      onChange={handleImagem}
                      required
                  />

                  <button className="bg-green-500! px-4 py-5! w-full rounded-lg text-center" type="submit">
                      Cadastrar
                  </button>
              </form>

              <div
                  className="w-64 h-64 mt-4 rounded-lg bg-center bg-cover"
                  style={{
                      backgroundImage: imagem ? `url(${imagem})` : 'none',
                  }}
              />
          </div>
      </div>
  );
}

export default CriarProduto
