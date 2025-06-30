import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { HouseholdFormData } from '@/services/households/households.types';

interface HousingSectionProps {
  form: UseFormReturn<HouseholdFormData>;
}

const HousingSection: React.FC<HousingSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
        Housing Information
      </h2>
      <div className="border-b border-gray-200 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House Type
          </label>
          <select
            {...register('house_type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          >
            <option value="">Select House Type</option>
            <option value="CONCRETE">Concrete</option>
            <option value="SEMI_CONCRETE">Semi-Concrete</option>
            <option value="WOOD">Wood</option>
            <option value="BAMBOO">Bamboo</option>
            <option value="MIXED">Mixed Materials</option>
          </select>
          {errors.house_type && (
            <p className="mt-1 text-sm text-red-600">{errors.house_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ownership Status
          </label>
          <select
            {...register('ownership_status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          >
            <option value="">Select Ownership</option>
            <option value="OWNED">Owned</option>
            <option value="RENTED">Rented</option>
            <option value="SHARED">Shared</option>
            <option value="INFORMAL_SETTLER">Informal Settler</option>
          </select>
          {errors.ownership_status && (
            <p className="mt-1 text-sm text-red-600">{errors.ownership_status.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Utilities Access
        </label>
        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              {...register('has_electricity')}
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
            />
            <span className="text-sm text-gray-700">Electricity</span>
          </label>

          <label className="flex items-center">
            <input
              {...register('has_water_supply')}
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
            />
            <span className="text-sm text-gray-700">Water Supply</span>
          </label>

          <label className="flex items-center">
            <input
              {...register('has_internet_access')}
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
            />
            <span className="text-sm text-gray-700">Internet Access</span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default HousingSection;