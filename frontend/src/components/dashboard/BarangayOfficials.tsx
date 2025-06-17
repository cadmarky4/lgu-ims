import React from 'react';

const BarangayOfficials: React.FC = () => {
  const officials = [
    {
      id: 1,
      name: 'Juan D. Cruz',
      position: 'Barangay Captain',
      email: 'juan.cruz@barangay.gov.ph',
      contact: '(02) 8123-4567',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Maria L. Santos',
      position: 'Barangay Councilor',
      email: 'maria.santos@barangay.gov.ph',
      contact: '(02) 8123-4568',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Jose M. Reyes',
      position: 'Barangay Councilor',
      email: 'jose.reyes@barangay.gov.ph',
      contact: '(02) 8123-4569',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 4,
      name: 'Anna K. Dela Cruz',
      position: 'Barangay Councilor',
      email: 'anna.delacruz@barangay.gov.ph',
      contact: '(02) 8123-4570',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 5,
      name: 'Carlos B. Mendoza',
      position: 'Barangay Councilor',
      email: 'carlos.mendoza@barangay.gov.ph',
      contact: '(02) 8123-4571',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 6,
      name: 'Liza T. Navarro',
      position: 'Barangay Councilor',
      email: 'liza.navarro@barangay.gov.ph',
      contact: '(02) 8123-4572',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
        Barangay Officials
      </h3>

      <div className="space-y-6">
        {/* Barangay Captain Section */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Barangay Captain</h4>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={officials[0].photo}
              alt={officials[0].name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">{officials[0].name}</h5>
              <p className="text-sm text-gray-600">Email: {officials[0].email}</p>
              <p className="text-sm text-gray-600">Contact No.: {officials[0].contact}</p>
            </div>
          </div>
        </div>

        {/* Barangay Councilors Section */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Barangay Councilors</h4>
          <div className="space-y-3">
            {officials.slice(1).map((official) => (
              <div key={official.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={official.photo}
                  alt={official.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{official.name}</h5>
                  <p className="text-sm text-gray-600">Email: {official.email}</p>
                  <p className="text-sm text-gray-600">Contact No.: {official.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangayOfficials; 

