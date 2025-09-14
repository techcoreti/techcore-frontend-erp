# TechCore Retaguarda

Sistema de retaguarda multi-tenant desenvolvido em React com TypeScript, baseado na estrutura do banco de dados SQL fornecido.

## 🚀 Características

- **Multi-tenant**: Sistema que suporta múltiplas empresas
- **Autenticação**: Login por CNPJ, usuário e senha
- **Interface Moderna**: Design responsivo com Tailwind CSS
- **TypeScript**: Tipagem completa baseada na estrutura do banco
- **Dados Mockados**: Sistema totalmente funcional com dados de exemplo

## 📋 Módulos Disponíveis

- **Dashboard**: Visão geral com métricas e gráficos
- **Clientes**: Gestão de clientes
- **Fornecedores**: Gestão de fornecedores
- **Produtos**: Catálogo de produtos
- **Estoque**: Controle de estoque e movimentações
- **Vendas**: Gestão de vendas
- **Relatórios**: Análises e relatórios

## 🛠️ Tecnologias Utilizadas

- React 18
- TypeScript
- React Router DOM
- Tailwind CSS
- React Hook Form
- React Hot Toast
- Recharts (gráficos)
- Lucide React (ícones)

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar o projeto:**
   ```bash
   npm start
   ```

3. **Acessar no navegador:**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciais de Teste

### Empresa 1 - TechCore Solutions LTDA
- **CNPJ:** 12.345.678/0001-90
- **Usuário:** admin
- **Senha:** 123456

### Empresa 2 - Loja Moderna EIRELI
- **CNPJ:** 98.765.432/0001-10
- **Usuário:** vendedor
- **Senha:** 123456

### Empresa 3 - Supermercado Central S/A
- **CNPJ:** 11.222.333/0001-44
- **Usuário:** gerente
- **Senha:** 123456

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🎨 Interface

- **Sidebar**: Navegação lateral com menu colapsível
- **Navbar**: Barra superior com informações da empresa
- **Cards**: Componentes visuais para métricas
- **Tabelas**: Listagens com paginação e filtros
- **Modais**: Formulários e visualizações detalhadas
- **Gráficos**: Visualizações de dados com Recharts

## 📊 Dados Mockados

O sistema inclui dados de exemplo para todas as funcionalidades:
- Clientes cadastrados
- Fornecedores
- Produtos e estoque
- Vendas realizadas
- Métricas do dashboard
- Gráficos de performance

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── Layout/         # Layout principal (Sidebar, Navbar)
├── contexts/           # Contextos React (Auth)
├── data/              # Dados mockados
├── pages/             # Páginas do sistema
├── routes/            # Configuração de rotas
├── styles/            # Estilos globais
├── types/             # Definições TypeScript
└── App.tsx            # Componente principal
```

## 🚀 Próximos Passos

Para conectar com um backend real:
1. Substituir dados mockados por chamadas de API
2. Implementar autenticação JWT
3. Adicionar validação de formulários
4. Implementar upload de arquivos
5. Adicionar testes unitários

## 📄 Licença

Este projeto foi desenvolvido como demonstração técnica.
# techcore-frontend-erp
