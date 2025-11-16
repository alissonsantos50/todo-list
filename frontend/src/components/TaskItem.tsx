import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../services/api';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  focusNewTaskInput: () => void;
}

export default function TaskItem({ task, focusNewTaskInput }: TaskItemProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const deleteTask = useMutation({
    mutationFn: () => api.delete(`/tasks/${task.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowConfirmModal(false);
    },
  });

  const editTask = useMutation({
    mutationFn: (newTitle: string) =>
      api.put(`/tasks/${task.id}`, { title: newTitle }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditing(false);
      focusNewTaskInput();
    },
  });

  const toggleTask = useMutation({
    mutationFn: () =>
      api.put(`/tasks/${task.id}`, { finished: !task.finished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return (
    <li className='flex items-center justify-between p-4 bg-white rounded-lg shadow-md'>
      <div className='flex items-center'>
        <div className='flex items-center'>
          <input
            type='checkbox'
            checked={task.finished}
            onChange={() => toggleTask.mutate()}
            className='w-6 h-6 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
          />
          {isEditing ? (
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                editTask.mutate(title);
                setIsEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  editTask.mutate(title);
                  setIsEditing(false);
                }
              }}
              className='ml-4 border-b-2 border-indigo-500 focus:outline-none'
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className={`ml-4 text-lg ${
                task.finished ? 'line-through text-gray-500' : ''
              }`}
            >
              {task.title}
            </span>
          )}
        </div>
      </div>
      <div className='flex space-x-2'>
        <button
          onClick={() => setShowConfirmModal(true)}
          className='px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700'
        >
          Excluir
        </button>
      </div>

      {showConfirmModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-lg font-bold mb-4'>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir esta tarefa?</p>
            <div className='mt-4 flex justify-end space-x-2'>
              <button
                onClick={() => setShowConfirmModal(false)}
                className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteTask.mutate()}
                disabled={deleteTask.isPending}
                className='px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
