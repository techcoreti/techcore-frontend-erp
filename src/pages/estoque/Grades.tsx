import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Palette, Ruler, Tag } from 'lucide-react';
import DropdownMenu from '../../components/DropdownMenu';
import Pagination from '../../components/Pagination';

const Grades: React.FC = () => {
  const [grades] = useState([
    {
      id: '1',
      tipo_grade: 'cor',
      nome: 'Cores Básicas',
      itens: ['Azul', 'Vermelho', 'Verde', 'Amarelo', 'Preto', 'Branco'],
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      tipo_grade: 'tamanho',
      nome: 'Tamanhos de Roupa',
      itens: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
      created_at: '2024-01-16T10:00:00Z'
    },
    {
      id: '3',
      tipo_grade: 'tamanho',
      nome: 'Tamanhos de Calçado',
      itens: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
      created_at: '2024-01-17T10:00:00Z'
    },
    {
      id: '4',
      tipo_grade: 'cor',
      nome: 'Cores Metálicas',
      itens: ['Dourado', 'Prateado', 'Bronze', 'Cobre'],
      created_at: '2024-01-18T10:00:00Z'
    },
    {
      id: '5',
      tipo_grade: 'tipo',
      nome: 'Tipos de Material',
      itens: ['Algodão', 'Poliester', 'Lã', 'Seda', 'Jeans'],
      created_at: '2024-01-19T10:00:00Z'
    },
    {
      id: '6',
      tipo_grade: 'tamanho',
      nome: 'Tamanhos de Acessórios',
      itens: ['Pequeno', 'Médio', 'Grande', 'Extra Grande'],
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '7',
      tipo_grade: 'cor',
      nome: 'Cores Pastel',
      itens: ['Rosa', 'Lilás', 'Azul Claro', 'Verde Claro', 'Amarelo Claro'],
      created_at: '2024-01-21T10:00:00Z'
    },
    {
      id: '8',
      tipo_grade: 'tipo',
      nome: 'Tipos de Tecido',
      itens: ['Malha', 'Tricot', 'Sarja', 'Oxford', 'Popeline'],
      created_at: '2024-01-22T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredGrades = grades.filter(grade =>
    grade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.tipo_grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.itens.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calcular dados de paginação
  const totalPages = Math.ceil(filteredGrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGrades = filteredGrades.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset para primeira página
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cor':
        return <Palette className="h-5 w-5 text-blue-500" />;
      case 'tamanho':
        return <Ruler className="h-5 w-5 text-green-500" />;
      case 'tipo':
        return <Tag className="h-5 w-5 text-purple-500" />;
      default:
        return <Tag className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'cor':
        return 'bg-blue-100 text-blue-800';
      case 'tamanho':
        return 'bg-green-100 text-green-800';
      case 'tipo':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'cor':
        return 'Cor';
      case 'tamanho':
        return 'Tamanho';
      case 'tipo':
        return 'Tipo';
      default:
        return tipo;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600">Gerencie as grades de produtos (cores, tamanhos, tipos)</p>
        </div>
        <button className="btn-action add">
          <div className="icon-section">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-section">Nova</div>
        </button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, tipo ou itens da grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="input">
              <option value="">Todos os tipos</option>
              <option value="cor">Cor</option>
              <option value="tamanho">Tamanho</option>
              <option value="tipo">Tipo</option>
            </select>
            <button className="btn-action filter">
              <div className="icon-section">
                <Search className="h-4 w-4" />
              </div>
              <div className="text-section">Filtrar</div>
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTipoIcon(grade.tipo_grade)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {grade.nome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(grade.tipo_grade)}`}>
                      {getTipoLabel(grade.tipo_grade)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {grade.itens.slice(0, 3).map((item, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {item}
                        </span>
                      ))}
                      {grade.itens.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
                          +{grade.itens.length - 3} mais
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {grade.itens.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(grade.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <DropdownMenu
                        items={[
                          {
                            label: 'Visualizar',
                            icon: <Eye className="dropdown-icon view" />,
                            onClick: () => console.log('Visualizar grade')
                          },
                          {
                            label: 'Editar',
                            icon: <Edit className="dropdown-icon edit" />,
                            onClick: () => console.log('Editar grade')
                          },
                          {
                            label: 'Excluir',
                            icon: <Trash2 className="dropdown-icon delete" />,
                            onClick: () => console.log('Excluir grade'),
                            className: 'text-red-600 hover:text-red-800 hover:bg-red-50'
                          }
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredGrades.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default Grades;
