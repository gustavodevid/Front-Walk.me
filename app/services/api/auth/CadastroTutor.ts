// cadastroService.ts
import axios from 'axios';
import config from '../../../../config';

const cadastroTutor = async (nome: string, email: string, senha: string) => {
    return axios.post(`${config.API_URL}/tutor`, {nome, email, senha})
};

export default cadastroTutor;