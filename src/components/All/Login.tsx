import { useState, useContext, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AuthData } from '../../Data/AuthData';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { Context } from '../../context/ContextProvider';
import { getToken } from '../../Services/Storage';
import type { LoginType, User } from '../../Types/Types';

const Login = () => {
    //CONTEXT
    const { setLogin } = useContext(Context)!;

    //ROUTER
    const navigate = useNavigate();

    //STATE
    const [user, setUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    //EFFECT
    useEffect(() => {
        async function start() {
            //PEGA TOKNEN GUARDADO NO LOCAL STORAGE
            await getToken()
                .then(async (token: string) => {
                    //VALIDA TOKEN E RETORNA USER
                    await AuthData.getProfile(
                        JSON.parse(token),
                        'https://dotnet-webapi-base-production.up.railway.app/api/usuario/profile'
                    )
                        .then((profile: User) => {
                            // SE TOKEN FOR VALIDADO GUARDADO DADOS DO USUARIO NO CONTEXT
                            console.log('Usuario autenticado.');
                            setLogin(profile);
                            navigate('/');
                        })
                        .catch((er: Error) => {
                            // SE O TOKEN NÃO FOR VALIDADO RETORNA A TELA DE AUTENTICAÇÃO
                            console.log(er);
                            setLoading(false);
                        });
                })
                .catch((er: Error) => {
                    // SE NÃO HOUVER TOKEN RETORNA A TELA DE AUTENTICAÇÃO
                    console.log(er);
                    setLoading(false);
                });
        }

        start();
    }, []);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const login: LoginType = {
            user: user,
            senha: password,
        };

        setLoading(true);

        await AuthData.login(login, 'https://dotnet-webapi-base-production.up.railway.app/login')
            .then(async (token: string) => {
                await AuthData.getProfile(
                    token,
                    'https://dotnet-webapi-base-production.up.railway.app/api/usuario/profile'
                )
                    .then((profile: User) => {
                        console.log('usuario autenticado:');
                        setLogin(profile);
                        navigate('/');
                    })
                    .catch((er: Error) => alert(er));
            })
            .catch((er: Error) => {
                (alert(er), setLoading(false));
            });
    };

    if (loading == true) return <Loading />;

    return (
        <div
            className="w-full max-w-md p-8 rounded-2xl shadow-lg mt-50
                 bg-white/10 backdrop-blur-md"
        >
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>

            <form
                onSubmit={(e) => {
                    handleLogin(e);
                }}
                className="flex flex-col gap-5"
            >
                <input
                    type="text"
                    placeholder="Insira o usuário"
                    value={user}
                    onChange={handleUserChange}
                    className="p-3 rounded-lg border border-gray-300 bg-slate-200
                        focus:outline-none
                        focus:border-2 focus:border-cyan-300
                        transition
                        duration-200"
                />

                <input
                    type="password"
                    placeholder="Insira a senha"
                    value={password}
                    onChange={handlePasswordChange}
                    className="p-3 rounded-lg border border-gray-300 bg-slate-200
                        focus:outline-none
                        focus:border-2 focus:border-cyan-300
                        transition
                        duration-200"
                />

                <button
                    type="submit"
                    className="mt-2 bg-blue-600 text-white font-semibold py-3 rounded-lg
                        hover:bg-blue-700
                        transition duration-200
                        focus:outline-none
                        focus:ring-2 focus:ring-cyan-500
                        focus:border-white"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;
