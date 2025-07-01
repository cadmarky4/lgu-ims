import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { HouseholdFormData } from '@/services/households/households.types';

interface RemarksSectionProps {
  form: UseFormReturn<HouseholdFormData>;
}

const RemarksSection: React.FC<RemarksSectionProps> = ({ form }) => {
  const { register, formState: { errors } } = form;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
        Remarks
      </h2>
      <div className="border-b border-gray-200 mb-6"></div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes or Comments
        </label>
        <textarea
          {...register('remarks')}
          placeholder="Enter any additional information, notes, or special circumstances about this household..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
        />
        {errors.remarks && (
          <p className="mt-1 text-sm text-red-600">{errors.remarks.message}</p>
        )}
      </div>
    </section>
  );
};

export default RemarksSection;