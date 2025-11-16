import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import type { ListTasksOutput } from '../types/task';

type Filter = 'all' | 'pending' | 'completed';

export default function TaskList() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  const { data, isLoading, isError, error } = useQuery<ListTasksOutput>({
    queryKey: ['tasks', page, limit, filter],
    queryFn: async () => {
      try {
        const response = await api.get('/tasks', {
          params: { page, limit, filter },
        });
        return response.data;
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          setToken(null);
          navigate('/login');
        }
        throw err;
      }
    },
  });

  const tasks = data?.tasks;
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const filteredTasks = tasks?.filter((task) => {
    if (filter === 'pending') return !task.finished;
    if (filter === 'completed') return task.finished;
    return true;
  });

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleLogout = () => {
    setToken(null);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <nav className='flex items-center justify-between p-4 bg-white shadow-md'>
        <h1 className='text-2xl font-bold'>Lista de Tarefas</h1>
        <button
          onClick={handleLogout}
          className='px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
        >
          Sair
        </button>
      </nav>
      <main className='p-4 mx-auto max-w-3xl'>
        <CreateTaskForm />
        <div className='flex justify-center my-4 space-x-4'>
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => handleFilterChange('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-white'
            }`}
          >
            Concluídas
          </button>
        </div>
        <div className='flex items-center justify-end my-4'>
          <label htmlFor='limit-select' className='mr-2'>
            Tarefas por página:
          </label>
          <select
            id='limit-select'
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className='px-3 py-2 border rounded-md'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {isLoading && <p>Carregando tarefas...</p>}
        {isError && <p>Erro: {error.message}</p>}
        <ul className='space-y-4'>
          {filteredTasks?.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
        {totalPages > 1 && (
          <div className='flex items-center justify-center mt-4 space-x-4'>
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className='px-4 py-2 font-medium text-white bg-indigo-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700'
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className='px-4 py-2 font-medium text-white bg-indigo-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700'
            >
              Próxima
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
