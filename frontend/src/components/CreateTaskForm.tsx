import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../services/api';

export default function CreateTaskForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');

  const createTask = useMutation({
    mutationFn: () => api.post('/tasks', { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setTitle('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createTask.mutate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex mt-4'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='w-full px-3 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
        placeholder='Adicionar nova tarefa'
      />
      <button
        type='submit'
        className='px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700'
        disabled={createTask.isPending}
      >
        {createTask.isPending ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  );
}
