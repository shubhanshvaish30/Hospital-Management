import axios from 'axios'

const api=axios.create({
    baseURL: 'https://hospital-management-3tyt.onrender.com/auth',
});

const googleAuth = (code) => {
    return api.get(`/google?code=${code}&redirect_uri=https://hospital-management-3tyt.onrender.com/auth/google`);
  };

export default googleAuth;