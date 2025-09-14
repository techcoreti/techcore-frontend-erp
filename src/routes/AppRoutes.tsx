import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Clientes from '../pages/Clientes';
import EnderecosClientes from '../pages/clientes/Enderecos';
import ContatosClientes from '../pages/clientes/Contatos';
import Fornecedores from '../pages/Fornecedores';
import EnderecosFornecedores from '../pages/fornecedores/Enderecos';
import ContatosFornecedores from '../pages/fornecedores/Contatos';
import Produtos from '../pages/Produtos';
import CategoriasProdutos from '../pages/produtos/Categorias';
import TiposProduto from '../pages/produtos/Tipos';
import MarcasProdutos from '../pages/produtos/Marcas';
import Estoque from '../pages/Estoque';
import TiposEstoque from '../pages/estoque/Tipos';
import MovimentacoesEstoque from '../pages/estoque/Movimentacoes';
import Grades from '../pages/estoque/Grades';
import Pagamentos from '../pages/Pagamentos';
import TiposPagamento from '../pages/pagamentos/Tipos';
import Vendas from '../pages/Vendas';
import Relatorios from '../pages/Relatorios';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/enderecos" element={<EnderecosClientes />} />
              <Route path="/clientes/contatos" element={<ContatosClientes />} />
              <Route path="/fornecedores" element={<Fornecedores />} />
              <Route path="/fornecedores/enderecos" element={<EnderecosFornecedores />} />
              <Route path="/fornecedores/contatos" element={<ContatosFornecedores />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/produtos/categorias" element={<CategoriasProdutos />} />
              <Route path="/produtos/tipos" element={<TiposProduto />} />
              <Route path="/produtos/marcas" element={<MarcasProdutos />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/estoque/tipos" element={<TiposEstoque />} />
              <Route path="/estoque/movimentacoes" element={<MovimentacoesEstoque />} />
              <Route path="/estoque/grades" element={<Grades />} />
              <Route path="/pagamentos" element={<Pagamentos />} />
              <Route path="/pagamentos/tipos" element={<TiposPagamento />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
