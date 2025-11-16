import { createContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextData {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('todo_app_token')
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('todo_app_token', token);
    } else {
      localStorage.removeItem('todo_app_token');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
