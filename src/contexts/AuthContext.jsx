import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um token de autenticação no localStorage
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Lógica de autenticação simples para demonstração
    // Substituir por integração com Supabase futuramente
    if (username === 'admin' && password === 'admin') {
      const token = 'admin_token_' + Date.now(); // Token simples para demonstração
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, error: 'Nome de usuário ou senha inválidos.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

