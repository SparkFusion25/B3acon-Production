import React, { useState, useMemo } from 'react';
import { 
  Search,
  Filter,
  Download,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  CheckCircle,
  Users,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Target
} from 'lucide-react';
import '../../styles/premium-b3acon-design-system.css';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface PremiumDataTableProps {
  title: string;
  subtitle?: string;
  data: any[];
  columns: Column[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      icon?: React.ComponentType<any>;
    };
    row?: {
      view?: (row: any) => void;
      edit?: (row: any) => void;
      delete?: (row: any) => void;
    };
  };
  loading?: boolean;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
  };
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const PremiumButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'medium', className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`btn-premium btn-${variant} btn-${size} ${className}`}
    >
      {children}
    </button>
  );
};

const TableSkeleton: React.FC<{ rows: number; cols: number }> = ({ rows, cols }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {[...Array(cols)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="skeleton h-4"
              style={{ width: `${Math.random() * 40 + 60}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const PremiumPagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg border ${
              page === currentPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PremiumDataTable: React.FC<PremiumDataTableProps> = ({
  title,
  subtitle,
  data,
  columns,
  searchable = true,
  filterable = true,
  exportable = true,
  selectable = false,
  actions,
  loading = false,
  pagination = { enabled: true, pageSize: 25 }
}) => {
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    if (search) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    
    return filtered;
  }, [data, search]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination.enabled) return sortedData;
    
    const startIndex = (currentPage - 1) * (pagination.pageSize || 25);
    return sortedData.slice(startIndex, startIndex + (pagination.pageSize || 25));
  }, [sortedData, currentPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / (pagination.pageSize || 25));

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="table-premium">
      {/* Table Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-premium pl-10 pr-4 py-2 w-64"
                />
              </div>
            )}
            
            {/* Filters */}
            {filterable && (
              <PremiumButton 
                variant="outline" 
                size="small"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </PremiumButton>
            )}
            
            {/* Export */}
            {exportable && (
              <PremiumButton variant="outline" size="small">
                <Download className="w-4 h-4 mr-2" />
                Export
              </PremiumButton>
            )}
            
            {/* Primary Action */}
            {actions?.primary && (
              <PremiumButton 
                variant="primary" 
                size="small" 
                onClick={actions.primary.onClick}
              >
                {actions.primary.icon && <actions.primary.icon className="w-4 h-4 mr-2" />}
                {actions.primary.label}
              </PremiumButton>
            )}
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectable && selectedRows.length > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <span className="text-blue-700 font-medium">
              {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <PremiumButton variant="outline" size="small">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </PremiumButton>
              <PremiumButton variant="danger" size="small">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </PremiumButton>
            </div>
          </div>
        )}
      </div>
      
      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={columns.length} />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {selectable && (
                  <th className="w-8 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="text-gray-400">
                          {getSortIcon(column.key)}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions?.row && (
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions?.row && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.row.view && (
                          <button
                            onClick={() => actions.row!.view!(row)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {actions.row.edit && (
                          <button
                            onClick={() => actions.row!.edit!(row)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {actions.row.delete && (
                          <button
                            onClick={() => actions.row!.delete!(row)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Table Footer with Pagination */}
      {pagination.enabled && !loading && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <PremiumPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedData.length}
            itemsPerPage={pagination.pageSize || 25}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

// Pre-built table configurations for different data types

export const ClientsTable: React.FC<{ data: any[]; onAddClient: () => void }> = ({ data, onAddClient }) => {
  const columns: Column[] = [
    {
      key: 'name',
      label: 'Client',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.industry}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`status-indicator ${
          value === 'active' ? 'status-success' : 
          value === 'pending' ? 'status-warning' : 'status-error'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (value) => (
        <div className="font-semibold text-gray-900">${value.toLocaleString()}</div>
      )
    },
    {
      key: 'last_contact',
      label: 'Last Contact',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-900">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <PremiumDataTable
      title="Client Directory"
      subtitle="Manage your client relationships and communications"
      data={data}
      columns={columns}
      selectable={true}
      actions={{
        primary: {
          label: 'Add Client',
          onClick: onAddClient,
          icon: Plus
        },
        row: {
          view: (row) => console.log('View client:', row),
          edit: (row) => console.log('Edit client:', row),
          delete: (row) => console.log('Delete client:', row)
        }
      }}
    />
  );
};

export const DealsTable: React.FC<{ data: any[]; onAddDeal: () => void }> = ({ data, onAddDeal }) => {
  const columns: Column[] = [
    {
      key: 'title',
      label: 'Deal Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.client_name}</div>
          </div>
        </div>
      )
    },
    {
      key: 'value',
      label: 'Value',
      sortable: true,
      render: (value, row) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">${value.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{row.currency}</div>
        </div>
      )
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (value) => (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
          value === 'closed_won' ? 'bg-emerald-100 text-emerald-800' :
          value === 'negotiation' ? 'bg-amber-100 text-amber-800' :
          value === 'proposal' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    {
      key: 'probability',
      label: 'Probability',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      )
    },
    {
      key: 'expected_close_date',
      label: 'Close Date',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-900">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <PremiumDataTable
      title="Sales Pipeline"
      subtitle="Track deals and manage your sales process"
      data={data}
      columns={columns}
      selectable={true}
      actions={{
        primary: {
          label: 'Add Deal',
          onClick: onAddDeal,
          icon: Plus
        },
        row: {
          view: (row) => console.log('View deal:', row),
          edit: (row) => console.log('Edit deal:', row),
          delete: (row) => console.log('Delete deal:', row)
        }
      }}
    />
  );
};

export const ContactsTable: React.FC<{ data: any[]; onAddContact: () => void }> = ({ data, onAddContact }) => {
  const columns: Column[] = [
    {
      key: 'name',
      label: 'Contact',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <img 
            className="w-10 h-10 rounded-full bg-gray-300" 
            src={row.avatar || `https://ui-avatars.com/api/?name=${row.first_name}+${row.last_name}`}
            alt={`${row.first_name} ${row.last_name}`}
          />
          <div>
            <div className="font-medium text-gray-900">{row.first_name} {row.last_name}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'position',
      label: 'Position',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.company}</div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800 transition-colors">
          {value}
        </a>
      )
    },
    {
      key: 'last_contact',
      label: 'Last Contact',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-gray-900">
          {value ? new Date(value).toLocaleDateString() : 'Never'}
        </div>
      )
    },
    {
      key: 'is_primary',
      label: 'Primary',
      render: (value) => (
        value ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : null
      )
    }
  ];

  return (
    <PremiumDataTable
      title="Contacts Directory"
      subtitle="Manage client contacts and communication history"
      data={data}
      columns={columns}
      selectable={true}
      actions={{
        primary: {
          label: 'Add Contact',
          onClick: onAddContact,
          icon: Plus
        },
        row: {
          view: (row) => console.log('View contact:', row),
          edit: (row) => console.log('Edit contact:', row),
          delete: (row) => console.log('Delete contact:', row)
        }
      }}
    />
  );
};

export default PremiumDataTable;