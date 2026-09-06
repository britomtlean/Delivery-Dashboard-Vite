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
    senha: string;
};

export type User = {
    id?: string;
    nome: string;
    user: string;
    senha: string;
    descricao?: string;
    endereco?: string;
    horario?: string;
    background?: string;
    whatsApp?: string;
    instagram?: string;
    color?: string;
};
