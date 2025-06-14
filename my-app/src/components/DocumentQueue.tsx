import React, { useState, useEffect } from 'react';
import { FiClock, FiEye, FiCheck, FiX, FiFileText, FiUser, FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { apiService } from '../services/api';

interface DocumentQueueProps {
  onNavigate: (page: string) => void;
}

interface QueueItem {
  id: number;
  document_type: string;
  resident_name: string;
  purpose: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'RELEASED' | 'REJECTED';
  request_date: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  estimated_completion: string;
  processing_fee: number;
  resident: {
    first_name: string;
    last_name: string;
    mobile_number?: string;
  };
}

const DocumentQueue: React.FC<DocumentQueueProps> = ({ onNavigate }) => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  const statusConfig = {
    PENDING: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: FiClock,
      label: 'Pending'
    },
    UNDER_REVIEW: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FiEye,
      label: 'Under Review'
    },
    APPROVED: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: FiCheck,
      label: 'Approved'
    },
    RELEASED: {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: FiFileText,
      label: 'Released'
    },
    REJECTED: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: FiX,
      label: 'Rejected'
    }
  };

  const priorityConfig = {
    LOW: { color: 'text-gray-500', label: 'Low' },
    NORMAL: { color: 'text-blue-500', label: 'Normal' },
    HIGH: { color: 'text-orange-500', label: 'High' },
    URGENT: { color: 'text-red-500', label: 'Urgent' }
  };

  useEffect(() => {
    fetchQueueItems();
  }, [selectedStatus]);

  const fetchQueueItems = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDocuments({
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        per_page: 50
      });
      
      // Mock priority data since API might not have it
      const itemsWithPriority = response.data.map((item: any) => ({
        ...item,
        priority: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.5 ? 'NORMAL' : 'LOW',
        estimated_completion: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setQueueItems(itemsWithPriority);
    } catch (err) {
      console.error('Failed to fetch queue items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = queueItems.filter(item =>
    item.resident_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCounts = () => {
    const counts = {
      PENDING: 0,
      UNDER_REVIEW: 0,
      APPROVED: 0,
      RELEASED: 0,
      REJECTED: 0
    };
    
    queueItems.forEach(item => {
      counts[item.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-darktext">Document Processing Queue</h1>
        <p className="text-gray-600 mt-1">Track and manage document processing workflow</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-5 divide-x divide-gray-200">
          {Object.entries(statusConfig).map(([status, config]) => {
            const IconComponent = config.icon;
            const count = statusCounts[status as keyof typeof statusCounts];
            
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`p-4 text-center hover:bg-gray-50 transition-colors ${
                  selectedStatus === status ? 'bg-smblue-50 border-b-2 border-smblue-400' : ''
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={`w-5 h-5 mr-2 ${
                    selectedStatus === status ? 'text-smblue-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-2xl font-bold ${
                    selectedStatus === status ? 'text-smblue-400' : 'text-gray-600'
                  }`}>
                    {count}
                  </span>
                </div>
                <p className={`text-sm font-medium ${
                  selectedStatus === status ? 'text-smblue-400' : 'text-gray-600'
                }`}>
                  {config.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by resident name or document type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
            />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {filteredItems.length} items in queue
            </span>
          </div>
        </div>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const StatusIcon = statusConfig[item.status].icon;
          const isOverdue = new Date(item.estimated_completion) < new Date();
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-smblue-100 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-smblue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.resident_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.resident.mobile_number}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Priority */}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gray-100 ${priorityConfig[item.priority].color}`}>
                        {priorityConfig[item.priority].label}
                      </span>
                      
                      {/* Status */}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status].color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[item.status].label}
                      </span>
                      
                      {/* Actions */}
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Document Type</p>
                      <p className="text-sm text-gray-900">
                        {item.document_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Purpose</p>
                      <p className="text-sm text-gray-900 truncate">
                        {item.purpose}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Processing Fee</p>
                      <p className="text-sm text-gray-900">
                        {item.processing_fee === 0 ? 'FREE' : `₱${item.processing_fee}`}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span>Requested: {new Date(item.request_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span className={isOverdue ? 'text-red-600' : 'text-gray-600'}>
                        Est. Completion: {new Date(item.estimated_completion).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Processing Progress</span>
                      <span>
                        {item.status === 'PENDING' ? '0%' :
                         item.status === 'UNDER_REVIEW' ? '25%' :
                         item.status === 'APPROVED' ? '75%' :
                         item.status === 'RELEASED' ? '100%' : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.status === 'PENDING' ? 'w-0 bg-yellow-400' :
                          item.status === 'UNDER_REVIEW' ? 'w-1/4 bg-blue-400' :
                          item.status === 'APPROVED' ? 'w-3/4 bg-green-400' :
                          item.status === 'RELEASED' ? 'w-full bg-green-400' :
                          'w-0 bg-red-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : `No documents with ${statusConfig[selectedStatus].label.toLowerCase()} status`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentQueue; 