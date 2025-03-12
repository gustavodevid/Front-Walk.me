import axios from 'axios';
import config from '../../../../config';

const loginTutor = async (email: string, senha: string) => {
    return axios.post(`${config.API_URL}/login/tutor`, { email, senha });
};

export default loginTutor;