import React from 'react';

const Notifications: React.FC = () => {
  const notifications = [
    {
      id: 1,
      message: 'New resident added in the record',
      time: '1hr ago',
      type: 'info'
    },
    {
      id: 2,
      message: 'New blotter added in the record',
      time: '1hr ago',
      type: 'info'
    },
    {
      id: 3,
      message: 'Blotter record resolved',
      time: '1hr ago',
      type: 'success'
    },
    {
      id: 4,
      message: 'Blotter record resolved',
      time: '1hr ago',
      type: 'success'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
        Notifications
      </h3>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <p className="text-sm text-gray-700 flex-1">
                {notification.message}
              </p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 