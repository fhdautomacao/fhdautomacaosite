-- Migration para criar tabelas de segurança adicionais

-- 1. Tabela para logs de segurança (deve vir primeiro)
CREATE TABLE IF NOT EXISTS security_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    activity_type text NOT NULL,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela para sessões ativas
CREATE TABLE IF NOT EXISTS active_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id text UNIQUE NOT NULL,
    user_agent text,
    ip_address text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_activity timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela para bloqueios de usuário
CREATE TABLE IF NOT EXISTS user_blocks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    reason text NOT NULL,
    blocked_until timestamp with time zone NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela para configurações de segurança por usuário
CREATE TABLE IF NOT EXISTS user_security_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    mfa_enabled boolean DEFAULT false,
    mfa_setup_completed_at timestamp with time zone,
    password_changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    login_notifications boolean DEFAULT true,
    trusted_devices jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela para tentativas de login
CREATE TABLE IF NOT EXISTS login_attempts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL,
    ip_address text,
    user_agent text,
    success boolean NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela para dispositivos confiáveis
CREATE TABLE IF NOT EXISTS trusted_devices (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id text NOT NULL,
    device_name text,
    device_type text,
    fingerprint text,
    last_used_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, device_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_activity_type ON security_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON active_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_activity ON active_sessions(last_activity);

CREATE INDEX IF NOT EXISTS idx_user_blocks_user_id ON user_blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked_until ON user_blocks(blocked_until);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_address ON login_attempts(ip_address);

CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_device_id ON trusted_devices(device_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para security_logs (apenas admins)
CREATE POLICY "Only admins can view security logs" ON security_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'adminfhd@fhd.com'
        )
    );

-- Políticas RLS para active_sessions
CREATE POLICY "Users can view own active sessions" ON active_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" ON active_sessions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions" ON active_sessions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions" ON active_sessions
    FOR DELETE USING (user_id = auth.uid());

-- Políticas RLS para user_blocks (apenas admins)
CREATE POLICY "Only admins can view user blocks" ON user_blocks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'adminfhd@fhd.com'
        )
    );

-- Políticas RLS para user_security_settings
CREATE POLICY "Users can view own security settings" ON user_security_settings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own security settings" ON user_security_settings
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own security settings" ON user_security_settings
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Políticas RLS para login_attempts (apenas admins)
CREATE POLICY "Only admins can view login attempts" ON login_attempts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'adminfhd@fhd.com'
        )
    );

-- Políticas RLS para trusted_devices
CREATE POLICY "Users can view own trusted devices" ON trusted_devices
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own trusted devices" ON trusted_devices
    FOR ALL USING (user_id = auth.uid());

-- Triggers para updated_at
CREATE TRIGGER update_user_security_settings_updated_at
    BEFORE UPDATE ON user_security_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para limpar sessões expiradas
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Remover sessões inativas por mais de 24 horas
    DELETE FROM active_sessions 
    WHERE last_activity < CURRENT_TIMESTAMP - INTERVAL '24 hours';
    
    -- Remover bloqueios expirados
    DELETE FROM user_blocks 
    WHERE blocked_until < CURRENT_TIMESTAMP;
    
    -- Remover tentativas de login antigas (mais de 30 dias)
    DELETE FROM login_attempts 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Remover logs de segurança antigos (mais de 90 dias)
    DELETE FROM security_logs 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
END;
$$;

-- Função para registrar tentativa de login
CREATE OR REPLACE FUNCTION log_login_attempt(
    user_email text,
    success boolean,
    error_msg text DEFAULT NULL,
    ip_addr text DEFAULT NULL,
    user_agent_string text DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO login_attempts (
        email,
        success,
        error_message,
        ip_address,
        user_agent
    ) VALUES (
        user_email,
        success,
        error_msg,
        ip_addr,
        user_agent_string
    );
END;
$$;

-- Função para criar configurações de segurança padrão para novo usuário
CREATE OR REPLACE FUNCTION create_default_security_settings()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO user_security_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Trigger para criar configurações padrão quando usuário é criado
CREATE TRIGGER create_user_security_settings
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_security_settings();

-- Comentários nas tabelas
COMMENT ON TABLE security_logs IS 'Logs de atividades de segurança do sistema';
COMMENT ON TABLE active_sessions IS 'Rastreamento de sessões ativas dos usuários';
COMMENT ON TABLE user_blocks IS 'Bloqueios temporários de usuários';
COMMENT ON TABLE user_security_settings IS 'Configurações de segurança por usuário';
COMMENT ON TABLE login_attempts IS 'Log de tentativas de login';
COMMENT ON TABLE trusted_devices IS 'Dispositivos confiáveis dos usuários';

COMMENT ON FUNCTION clean_expired_sessions() IS 'Remove sessões e registros expirados';
COMMENT ON FUNCTION log_login_attempt(text, boolean, text, text, text) IS 'Registra tentativas de login';
COMMENT ON FUNCTION create_default_security_settings() IS 'Cria configurações de segurança padrão para novos usuários';
