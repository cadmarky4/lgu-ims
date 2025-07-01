import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { HouseholdFormData } from '@/services/households/households.types';

interface HouseholdIdentificationSectionProps {
  form: UseFormReturn<HouseholdFormData>;
}

const HouseholdIdentificationSection: React.FC<HouseholdIdentificationSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
        Household Identification
      </h2>
      <div className="border-b border-gray-200 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Household Number *
          </label>
          <input
            {...register('household_number')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
            placeholder="Auto-generated if empty"
          />
          {errors.household_number && (
            <p className="mt-1 text-sm text-red-600">{errors.household_number.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Household Type *
          </label>
          <select
            {...register('household_type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          >
            <option value="">Select Household Type</option>
            <option value="NUCLEAR">Nuclear Family</option>
            <option value="EXTENDED">Extended Family</option>
            <option value="SINGLE">Single Person</option>
            <option value="SINGLE_PARENT">Single Parent</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.household_type && (
            <p className="mt-1 text-sm text-red-600">{errors.household_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barangay *
          </label>
          <input
            {...register('barangay')}
            type="text"
            placeholder="Enter barangay name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          />
          {errors.barangay && (
            <p className="mt-1 text-sm text-red-600">{errors.barangay.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street/Sitio *
          </label>
          <input
            {...register('street_sitio')}
            type="text"
            placeholder="Enter street or sitio name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          />
          {errors.street_sitio && (
            <p className="mt-1 text-sm text-red-600">{errors.street_sitio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House Number *
          </label>
          <input
            {...register('house_number')}
            type="text"
            placeholder="Enter house number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          />
          {errors.house_number && (
            <p className="mt-1 text-sm text-red-600">{errors.house_number.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complete Address *
          </label>
          <textarea
            {...register('complete_address')}
            placeholder="Enter complete household address"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          />
          {errors.complete_address && (
            <p className="mt-1 text-sm text-red-600">{errors.complete_address.message}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HouseholdIdentificationSection;