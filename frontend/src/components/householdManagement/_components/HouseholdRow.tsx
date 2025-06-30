import React from 'react';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import HouseholdActions from './HouseholdActions';
import { getHouseholdPrograms, formatIncomeRange, getProgramBadgeColor } from '../_utils/householdUtils';
import type { Household } from '@/services/households/households.types';

interface HouseholdRowProps {
  household: Household;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string, householdNumber: string) => void;
  isDeleting: boolean;
}

const HouseholdRow: React.FC<HouseholdRowProps> = ({
  household,
  onEdit,
  onView,
  onDelete,
  isDeleting
}) => {
  const programs = getHouseholdPrograms(household);
  const headName = household.head_resident 
    ? `${household.head_resident.first_name} ${household.head_resident.last_name}`
    : 'No Head Assigned';
  const memberCount = household.members ? household.members.length : 0;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {household.household_number}
        </div>
        <div className="text-sm text-gray-500">
          {household.house_type ? household.house_type.replace('_', ' ').toUpperCase() : 'Not specified'} • {household.ownership_status ? household.ownership_status.replace('_', ' ').toUpperCase() : 'Not specified'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {headName}
        </div>
        <div className="text-sm text-gray-500">
          {household.complete_address}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {memberCount} members
        </div>
        <div className="text-sm text-gray-500">
          Income: {household.monthly_income ? formatIncomeRange(household.monthly_income) : 'Not specified'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {programs.length > 0 ? (
            programs.map((program: string, index: number) => (
              <span
                key={index}
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProgramBadgeColor(program)}`}
              >
                {program}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">None</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <HouseholdActions
          household={household}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </td>
    </tr>
  );
};

export default HouseholdRow;