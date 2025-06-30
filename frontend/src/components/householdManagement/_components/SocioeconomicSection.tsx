import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { HouseholdFormData } from '@/services/households/households.types';

interface SocioeconomicSectionProps {
  form: UseFormReturn<HouseholdFormData>;
}

const SocioeconomicSection: React.FC<SocioeconomicSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
        Socioeconomic Information
      </h2>
      <div className="border-b border-gray-200 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Household Income
          </label>
          <select
            {...register('monthly_income')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          >
            <option value="">Select Income Range</option>
            <option value="BELOW_10000">Below ₱10,000</option>
            <option value="RANGE_10000_25000">₱10,000 - ₱25,000</option>
            <option value="RANGE_25000_50000">₱25,000 - ₱50,000</option>
            <option value="RANGE_50000_100000">₱50,000 - ₱100,000</option>
            <option value="ABOVE_100000">Above ₱100,000</option>
          </select>
          {errors.monthly_income && (
            <p className="mt-1 text-sm text-red-600">{errors.monthly_income.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Income Source
          </label>
          <input
            {...register('primary_income_source')}
            type="text"
            placeholder="e.g. Employment, Business, Agriculture"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          />
          {errors.primary_income_source && (
            <p className="mt-1 text-sm text-red-600">{errors.primary_income_source.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Household Classification
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center">
            <input
              {...register('four_ps_beneficiary')}
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
            />
            <span className="text-sm text-gray-700">4Ps Beneficiary</span>
          </label>

          <label className="flex items-center">
            <input
              {...register('indigent_family')}
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
            />
            <span className="text-sm text-gray-700">Indigent Family</span>
          </label>

          <label className="flex items-center">
            <input
              {...register('has_senior_citizen')}
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
            />
            <span className="text-sm text-gray-700">Has Senior Citizen</span>
          </label>

          <label className="flex items-center">
            <input
              {...register('has_pwd_member')}
              type="checkbox"
              className="mr-2 rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
            />
            <span className="text-sm text-gray-700">Has PWD member</span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default SocioeconomicSection;