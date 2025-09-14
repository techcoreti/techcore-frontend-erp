# Integração com API TechCore

Este projeto foi atualizado para se comunicar com todas as rotas existentes no Swagger da API TechCore (`http://localhost:3000/api/docs`).

## 🚀 Estrutura da Integração

### 1. Serviços de API (`src/services/`)

- **`api.ts`**: Configuração base do Axios com interceptors para autenticação e tratamento de erros
- **`index.ts`**: Serviços específicos para cada entidade (Clientes, Fornecedores, Produtos, etc.)

### 2. Tipos TypeScript (`src/types/api.ts`)

Todos os tipos foram definidos baseados nos schemas do Swagger:
- Interfaces para todas as entidades
- DTOs para criação e atualização
- Tipos para respostas da API

### 3. Hooks Personalizados (`src/hooks/useApi.ts`)

Hooks React para facilitar o uso dos serviços:
- `useAuth()`: Autenticação e perfil do usuário
- `useClientes()`: Gestão de clientes
- `useFornecedores()`: Gestão de fornecedores
- `useProdutos()`: Gestão de produtos
- `useEstoque()`: Gestão de estoque
- `useVendas()`: Gestão de vendas
- E muitos outros...

### 4. Configuração (`src/config/api.ts`)

Configurações centralizadas:
- URLs da API
- Padrões de validação
- Configurações de paginação
- Funções utilitárias

## 🔧 Como Usar

### Autenticação

```typescript
import { useAuth } from '../hooks/useApi';

const LoginComponent = () => {
  const { login, user, isLoading } = useAuth();

  const handleLogin = async (credentials) => {
    const success = await login(credentials);
    if (success) {
      // Usuário logado com sucesso
    }
  };

  return (
    // Seu componente de login
  );
};
```

### Listagem de Dados

```typescript
import { useClientes } from '../hooks/useApi';

const ClientesPage = () => {
  const { 
    clientes, 
    loading, 
    error, 
    createCliente, 
    updateCliente, 
    deleteCliente 
  } = useClientes();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {clientes.map(cliente => (
        <div key={cliente.id}>{cliente.razaoSocial}</div>
      ))}
    </div>
  );
};
```

### Criação de Dados

```typescript
const handleCreateCliente = async (data) => {
  try {
    await createCliente(data);
    toast.success('Cliente criado com sucesso!');
  } catch (error) {
    toast.error('Erro ao criar cliente');
  }
};
```

## 📋 Rotas Disponíveis

### Autenticação
- `POST /api/auth/login` - Login no sistema
- `GET /api/perfil` - Perfil do usuário logado

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Excluir usuário

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Excluir cliente
- `GET /api/clientes/:id/enderecos` - Endereços do cliente
- `POST /api/clientes/:id/enderecos` - Criar endereço
- `GET /api/clientes/:id/contatos` - Contatos do cliente
- `POST /api/clientes/:id/contatos` - Criar contato

### Fornecedores
- `GET /api/fornecedores` - Listar fornecedores
- `POST /api/fornecedores` - Criar fornecedor
- `PUT /api/fornecedores/:id` - Atualizar fornecedor
- `DELETE /api/fornecedores/:id` - Excluir fornecedor

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto

### Estoque
- `GET /api/estoque` - Listar estoque
- `POST /api/estoque` - Criar item de estoque
- `PUT /api/estoque/:id` - Atualizar estoque
- `DELETE /api/estoque/:id` - Excluir estoque
- `POST /api/estoque/:id/movimento` - Registrar movimento

### Vendas
- `GET /api/vendas` - Listar vendas
- `POST /api/vendas` - Criar venda
- `PUT /api/vendas/:id` - Atualizar venda
- `DELETE /api/vendas/:id` - Excluir venda
- `PATCH /api/vendas/:id/concluir` - Concluir venda
- `PATCH /api/vendas/:id/cancelar` - Cancelar venda

### Health Check
- `GET /api/health` - Status da aplicação
- `GET /api/health/detailed` - Status detalhado

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. **Login**: Envie CNPJ, email e senha para `/api/auth/login`
2. **Token**: O token JWT é retornado e armazenado no localStorage
3. **Headers**: Todas as requisições subsequentes incluem o token no header `Authorization: Bearer <token>`
4. **Expiração**: Tokens expirados redirecionam automaticamente para o login

## 🎨 Componentes Atualizados

### Dashboard
- Agora usa dados reais da API
- Mostra estatísticas de clientes, vendas, produtos e estoque
- Gráficos com dados reais

### Página de Clientes
- Listagem com dados da API
- Formulário de criação/edição
- Paginação e busca
- Estados de loading e erro

### Formulários
- Validação em tempo real
- Máscaras para CPF/CNPJ, telefone, CEP
- Feedback visual de erros

## 🚨 Tratamento de Erros

O sistema inclui tratamento automático de erros:

- **401**: Token expirado - redireciona para login
- **403**: Acesso negado - mostra mensagem
- **404**: Recurso não encontrado
- **409**: Conflito (ex: CNPJ já existe)
- **422**: Dados inválidos
- **500**: Erro interno do servidor

Todos os erros são exibidos como toast notifications.

## 📱 Estados de Loading

Todos os hooks incluem estados de loading:

```typescript
const { data, loading, error } = useClientes();

if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <DataComponent data={data} />;
```

## 🔄 Atualizações Automáticas

Os hooks automaticamente atualizam os dados após operações CRUD:

- Após criar um item, ele é adicionado à lista
- Após atualizar um item, ele é atualizado na lista
- Após excluir um item, ele é removido da lista

## 🛠️ Configuração

Para configurar a URL da API, edite `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Altere aqui
  TIMEOUT: 10000,
};
```

## 📚 Próximos Passos

1. **Testes**: Implementar testes unitários para os serviços
2. **Cache**: Adicionar cache para melhorar performance
3. **Offline**: Implementar suporte offline
4. **Upload**: Adicionar upload de arquivos
5. **Relatórios**: Implementar geração de relatórios

## 🐛 Troubleshooting

### Problemas Comuns

1. **CORS**: Certifique-se de que a API permite requisições do frontend
2. **Token**: Verifique se o token está sendo enviado corretamente
3. **URL**: Confirme se a URL da API está correta
4. **Rede**: Verifique se a API está rodando na porta correta

### Logs

Para debug, verifique o console do navegador e os logs da API.

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação da API: `http://localhost:3000/api/docs`
- Logs do console do navegador
- Logs da API no terminal
