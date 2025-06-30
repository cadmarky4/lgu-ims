import React from 'react';
import type { Household } from '@/services/households/households.types';

interface HouseholdClassificationGridProps {
  household: Household;
}

const HouseholdClassificationGrid: React.FC<HouseholdClassificationGridProps> = ({ household }) => {
  const classifications = [
    { label: '4Ps Beneficiary', value: household.four_ps_beneficiary },
    { label: 'Indigent Family', value: household.indigent_family },
    { label: 'Has Senior Citizen', value: household.has_senior_citizen },
    { label: 'Has PWD Member', value: household.has_pwd_member }
  ];

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
        Household Classification
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {classifications.map((classification, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${classification.value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm text-gray-700">{classification.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HouseholdClassificationGrid;