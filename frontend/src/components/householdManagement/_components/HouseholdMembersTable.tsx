import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { useResident } from '@/services/residents/useResidents';
import type { Household } from '@/services/households/households.types';

interface HouseholdMembersTableProps {
  household: Household;
}

const MemberRow: React.FC<{ memberId: number; relationship: string; index: number }> = ({ 
  memberId, 
  relationship, 
  index 
}) => {
  const { data: resident, isLoading } = useResident(memberId);

  if (isLoading) {
    return (
      <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-4 py-3 border-b" colSpan={3}>
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-4 w-20"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (!resident) {
    return (
      <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-4 py-3 border-b" colSpan={3}>
          <span className="text-red-500 text-sm">Resident not found</span>
        </td>
      </tr>
    );
  }

  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-4 py-3 border-b">
        {resident.first_name} {resident.last_name}
      </td>
      <td className="px-4 py-3 border-b text-sm text-gray-600">
        {resident.mobile_number || resident.landline_number || 'N/A'}
      </td>
      <td className="px-4 py-3 border-b">
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          {relationship}
        </span>
      </td>
    </tr>
  );
};

const HouseholdMembersTable: React.FC<HouseholdMembersTableProps> = ({ household }) => {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
        <FiUsers className="mr-2" />
        Household Members
      </h3>
      
      {/* Household Head */}
      {household.head_resident && (
        <div className="mb-4">
          <h4 className="font-medium text-darktext mb-2">Household Head:</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-darktext">
                  {household.head_resident.first_name} {household.head_resident.last_name}
                </p>
                <p className="text-sm text-gray-600">Use full resident details if needed</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                HOUSEHOLD HEAD
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Other Members */}
      {household.members && household.members.length > 0 ? (
        <div>
          <h4 className="font-medium text-darktext mb-2">Other Members:</h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Relationship</th>
                </tr>
              </thead>
              <tbody>
                {household.members.map((member, index) => (
                  <MemberRow
                    key={member.id}
                    memberId={member.id}
                    relationship={member.relationship}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-center">
            {household.head_resident ? 'No additional members registered' : 'No members registered yet'}
          </p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        Total household size: {(household.members?.length || 0) + (household.head_resident ? 1 : 0)} member{((household.members?.length || 0) + (household.head_resident ? 1 : 0)) !== 1 ? 's' : ''}
      </div>
    </section>
  );
};

export default HouseholdMembersTable;