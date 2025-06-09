-- Criação da tabela de perfis
CREATE TABLE perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    inscricao_estadual VARCHAR(20),
    inscricao_municipal VARCHAR(20),
    CONSTRAINT fk_usuario FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Criação da tabela de categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de certificações
CREATE TABLE IF NOT EXISTS certificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de fornecedores
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome_fantasia VARCHAR(100) NOT NULL,
    razao_social VARCHAR(100) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    inscricao_estadual VARCHAR(20),
    inscricao_municipal VARCHAR(20)
);

-- Criação da tabela de produtos
CREATE TABLE produtos (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    quantidade_estoque INTEGER NOT NULL DEFAULT 0,
    categoria_id INTEGER REFERENCES categorias(id),
    certificacao_id UUID REFERENCES certificacoes(id),
    fornecedor_id INTEGER REFERENCES fornecedores(id),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    preco_promocional DECIMAL(10,2)
);

-- Criação de índices para melhor performance
CREATE INDEX idx_perfis_email ON perfis(email);
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_certificacao ON produtos(certificacao_id);
CREATE INDEX idx_produtos_fornecedor ON produtos(fornecedor_id);
CREATE INDEX idx_fornecedores_cnpj ON fornecedores(cnpj);

-- Adicionar coluna de certificação na tabela de produtos
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS certificacao_id UUID REFERENCES certificacoes(id);

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_produtos_certificacao_id ON produtos(certificacao_id);

-- Adicionar coluna de localização na tabela de produtos
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS localizacao VARCHAR(255);

-- Adicionar coluna de unidade na tabela de produtos
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS unidade VARCHAR(10);

-- Adicionar coluna de preço promocional
ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS preco_promocional DECIMAL(10,2);

-- Criar índice para melhorar performance de busca por preço promocional
CREATE INDEX IF NOT EXISTS idx_produtos_preco_promocional ON produtos(preco_promocional);

-- Função para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION atualizar_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar data_atualizacao
CREATE TRIGGER trigger_atualizar_data_atualizacao_perfis
    BEFORE UPDATE ON perfis
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

CREATE TRIGGER trigger_atualizar_data_atualizacao_categorias
    BEFORE UPDATE ON categorias
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

CREATE TRIGGER trigger_atualizar_data_atualizacao_certificacoes
    BEFORE UPDATE ON certificacoes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

CREATE TRIGGER trigger_atualizar_data_atualizacao_fornecedores
    BEFORE UPDATE ON fornecedores
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

CREATE TRIGGER trigger_atualizar_data_atualizacao_produtos
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_atualizacao();

-- Habilitar Row Level Security em todas as tabelas
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela perfis
CREATE POLICY "Permitir visualização de perfis"
    ON perfis FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção de novos perfis"
    ON perfis FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
    ON perfis FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem deletar seus próprios dados"
    ON perfis FOR DELETE
    USING (auth.uid() = id);

-- Políticas para a tabela categorias
CREATE POLICY "Permitir visualização de categorias"
    ON categorias FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificação de categorias para usuários autenticados"
    ON categorias FOR ALL
    USING (auth.role() = 'authenticated');

-- Políticas para a tabela certificações
CREATE POLICY "Permitir visualização de certificações para todos"
    ON certificacoes FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserção de certificações para usuários autenticados"
    ON certificacoes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de certificações para usuários autenticados"
    ON certificacoes FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão de certificações para usuários autenticados"
    ON certificacoes FOR DELETE
    USING (auth.role() = 'authenticated');

-- Políticas para a tabela fornecedores
CREATE POLICY "Permitir visualização de fornecedores"
    ON fornecedores FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificação de fornecedores para usuários autenticados"
    ON fornecedores FOR ALL
    USING (auth.role() = 'authenticated');

-- Políticas para a tabela produtos
CREATE POLICY "Permitir visualização de produtos"
    ON produtos FOR SELECT
    USING (true);

CREATE POLICY "Permitir modificação de produtos para usuários autenticados"
    ON produtos FOR ALL
    USING (auth.role() = 'authenticated');

-- Trigger para atualizar data_atualizacao na tabela certificacoes
CREATE OR REPLACE FUNCTION atualizar_data_certificacoes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_data_certificacoes
    BEFORE UPDATE ON certificacoes
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_certificacoes();

-- Inserir certificações padrão
INSERT INTO certificacoes (nome, descricao) VALUES
    ('Orgânico', 'Produto cultivado sem uso de agrotóxicos ou fertilizantes sintéticos'),
    ('Fair Trade', 'Produto que segue os princípios do comércio justo'),
    ('Sustentável', 'Produto que segue práticas sustentáveis de produção'),
    ('Local', 'Produto cultivado na região local'),
    ('Biodinâmico', 'Produto cultivado seguindo os princípios da agricultura biodinâmica'),
    ('Vegano', 'Produto que não utiliza ingredientes de origem animal'),
    ('Sem Glúten', 'Produto livre de glúten'),
    ('Sem Lactose', 'Produto livre de lactose'),
    ('Natural', 'Produto com ingredientes naturais'),
    ('Artesanal', 'Produto feito manualmente')
ON CONFLICT (nome) DO NOTHING;

-- Alterar o tipo da coluna id para UUID e definir valor padrão
ALTER TABLE produtos ALTER COLUMN id TYPE UUID USING (uuid_generate_v4());
ALTER TABLE produtos ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Adicionar comentários nas colunas
COMMENT ON COLUMN fornecedores.inscricao_estadual IS 'Inscrição Estadual do fornecedor';
COMMENT ON COLUMN fornecedores.inscricao_municipal IS 'Inscrição Municipal do fornecedor';

-- Adicionar comentários nas colunas
COMMENT ON COLUMN perfis.inscricao_estadual IS 'Inscrição Estadual do perfil';
COMMENT ON COLUMN perfis.inscricao_municipal IS 'Inscrição Municipal do perfil';

-- Criar índices para melhorar a performance das buscas
CREATE INDEX IF NOT EXISTS idx_perfis_inscricao_estadual ON perfis(inscricao_estadual);
CREATE INDEX IF NOT EXISTS idx_perfis_inscricao_municipal ON perfis(inscricao_municipal);

-- Criação da tabela de pedidos
CREATE TABLE pedidos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    usuario_id UUID REFERENCES auth.users(id) NOT NULL,
    produto_id UUID REFERENCES produtos(id) NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado')),
    data_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    endereco_entrega JSONB NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_produto ON pedidos(produto_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);

-- Trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários da tabela
COMMENT ON TABLE pedidos IS 'Tabela para registro de pedidos do sistema';
COMMENT ON COLUMN pedidos.id IS 'Identificador único do pedido';
COMMENT ON COLUMN pedidos.usuario_id IS 'ID do usuário que fez o pedido';
COMMENT ON COLUMN pedidos.produto_id IS 'ID do produto pedido';
COMMENT ON COLUMN pedidos.quantidade IS 'Quantidade do produto pedida';
COMMENT ON COLUMN pedidos.valor_unitario IS 'Valor unitário do produto no momento do pedido';
COMMENT ON COLUMN pedidos.valor_total IS 'Valor total do pedido';
COMMENT ON COLUMN pedidos.status IS 'Status atual do pedido';
COMMENT ON COLUMN pedidos.data_pedido IS 'Data e hora do pedido';
COMMENT ON COLUMN pedidos.endereco_entrega IS 'Endereço de entrega em formato JSON';
COMMENT ON COLUMN pedidos.forma_pagamento IS 'Forma de pagamento escolhida';

-- Políticas de segurança para a tabela pedidos

-- Política para visualização de pedidos
CREATE POLICY "Permitir visualização de pedidos"
    ON pedidos FOR SELECT
    USING (
        -- Usuário pode ver seus próprios pedidos
        auth.uid() = usuario_id
        OR
        -- Usuário pode ver pedidos de produtos que ele vende
        EXISTS (
            SELECT 1 FROM produtos
            WHERE produtos.id = pedidos.produto_id
            AND produtos.usuario_id = auth.uid()
        )
    );

-- Política para inserção de pedidos
CREATE POLICY "Permitir inserção de pedidos para usuários autenticados"
    ON pedidos FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        AND auth.uid() = usuario_id
    );

-- Política para atualização de pedidos
CREATE POLICY "Permitir atualização de pedidos"
    ON pedidos FOR UPDATE
    USING (
        -- Usuário pode atualizar seus próprios pedidos
        auth.uid() = usuario_id
        OR
        -- Vendedor pode atualizar pedidos de seus produtos
        EXISTS (
            SELECT 1 FROM produtos
            WHERE produtos.id = pedidos.produto_id
            AND produtos.usuario_id = auth.uid()
        )
    );

-- Política para exclusão de pedidos
CREATE POLICY "Permitir exclusão de pedidos"
    ON pedidos FOR DELETE
    USING (
        -- Usuário pode excluir seus próprios pedidos
        auth.uid() = usuario_id
        OR
        -- Vendedor pode excluir pedidos de seus produtos
        EXISTS (
            SELECT 1 FROM produtos
            WHERE produtos.id = pedidos.produto_id
            AND produtos.usuario_id = auth.uid()
        )
    ); 