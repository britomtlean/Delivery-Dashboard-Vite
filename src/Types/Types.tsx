export type Product = {
    id?: string;
    nome: string;
    codigoBarra?: string;
    descricao?: string;
    categoria?: string;
    disponibilidade?: boolean;
    valor?: number;
    estoque?: number;
    imagem?: string;
    dataCriacao?: string;
};

export type LoginType = {
    user: string;
    password: string;
};

export type User = {
    id?: string;
    nome: string;
    user: string;
    senha: string;
};
