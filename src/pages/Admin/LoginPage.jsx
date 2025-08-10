import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Shield, Clock, AlertCircle } from 'lucide-react';
import { useJWTAuth } from '@/contexts/JWTAuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useJWTAuth();

  // Verificar se já está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/admin-fhd');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Verificar se houve logout por expiração de sessão
  useEffect(() => {
    const expired = localStorage.getItem('session_expired');
    if (expired === 'true') {
      setSessionExpired(true);
      localStorage.removeItem('session_expired');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSessionExpired(false);
    setLoading(true);

    console.log('Tentando login JWT:', { email, password: password ? '***' : 'vazio' });

    try {
      await login(email, password);
      navigate('/admin-fhd');
    } catch (error) {
      console.error('Erro no login JWT:', error);
      setError(error.message || 'Erro interno. Tente novamente.');
    }
    
    setLoading(false);
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="mx-auto p-3 bg-blue-600 rounded-lg w-fit mb-4"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gray-900">Acesso Administrativo</CardTitle>
            <CardDescription className="mt-2 text-gray-600">Faça login para acessar o painel.</CardDescription>
            
            {/* Alerta de sessão expirada */}
            {sessionExpired && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center text-red-800">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Sessão expirada</span>
                </div>
                <p className="text-red-600 text-xs mt-1">Faça login novamente para continuar.</p>
              </motion.div>
            )}
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    console.log('Email onChange:', e.target.value);
                    setEmail(e.target.value);
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    console.log('Password onChange:', e.target.value ? '***' : 'vazio');
                    setPassword(e.target.value);
                  }}
                  className="mt-1"
                />
              </div>
              {error && (
                <div className="flex items-center justify-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;


