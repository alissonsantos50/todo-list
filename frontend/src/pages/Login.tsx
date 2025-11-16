import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { AxiosError } from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => api.post('/login', { email, password }),
    onSuccess: (data) => {
      setToken(data.data.token);
      navigate('/');
    },
    onError: (error: AxiosError<any>) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(error.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    mutation.mutate();
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center'>Entrar</h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'
            >
              E-mail
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='text-sm font-medium text-gray-700'
            >
              Senha
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>
          <div>
            <button
              type='submit'
              className='w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Carregando...' : 'Entrar'}
            </button>
          </div>
        </form>
        {mutation.isError && (
          <p className='text-sm text-red-600'>Erro: {errorMessage}</p>
        )}
        <p className='text-sm text-center'>
          Não tem uma conta?{' '}
          <Link
            to='/register'
            className='font-medium text-indigo-600 hover:underline'
          >
            Registrar
          </Link>
        </p>
      </div>
    </div>
  );
}
