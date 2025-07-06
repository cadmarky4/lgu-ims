import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormReturn } from 'react-hook-form';
import type { HouseholdFormData } from '@/services/households/households.types';

interface HouseholdIdentificationSectionProps {
 form: UseFormReturn<HouseholdFormData>;
}

const HouseholdIdentificationSection: React.FC<HouseholdIdentificationSectionProps> = ({ form }) => {
 const { t } = useTranslation();
 const { register, formState: { errors } } = form;

 return (
   <section className="mb-8">
     <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
       {t('households.form.sections.basicInfo')}
     </h2>
     <div className="border-b border-gray-200 mb-6"></div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           {t('households.form.fields.householdNumber')} *
         </label>
         <input
           {...register('household_number')}
           type="text"
           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
           placeholder={t('households.form.placeholders.householdNumber')}
         />
         {errors.household_number && (
           <p className="mt-1 text-sm text-red-600">{errors.household_number.message}</p>
         )}
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           {t('households.form.fields.householdType')} *
         </label>
         <select
           {...register('household_type')}
           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
         >
           <option value="">{t('households.form.options.selectHouseholdType')}</option>
           <option value="NUCLEAR">{t('households.types.NUCLEAR')}</option>
           <option value="EXTENDED">{t('households.types.EXTENDED')}</option>
           <option value="SINGLE">{t('households.types.SINGLE')}</option>
           <option value="SINGLE_PARENT">{t('households.types.SINGLE_PARENT')}</option>
           <option value="OTHER">{t('households.types.OTHER')}</option>
         </select>
         {errors.household_type && (
           <p className="mt-1 text-sm text-red-600">{errors.household_type.message}</p>
         )}
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           {t('households.form.fields.barangay')} *
         </label>
         <input
           {...register('barangay')}
           type="text"
           placeholder={t('households.form.placeholders.barangay')}
           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
         />
         {errors.barangay && (
           <p className="mt-1 text-sm text-red-600">{errors.barangay.message}</p>
         )}
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           {t('households.form.fields.streetSitio')} *
         </label>
         <input
           {...register('street_sitio')}
           type="text"
           placeholder={t('households.form.placeholders.streetSitio')}
           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
         />
         {errors.street_sitio && (
           <p className="mt-1 text-sm text-red-600">{errors.street_sitio.message}</p>
         )}
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           {t('households.form.fields.houseNumber')} *
         </label>
         <input
           {...register('house_number')}
           type="text"
           placeholder={t('households.form.placeholders.houseNumber')}
           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
         />
         {errors.house_number && (
           <p className="mt-1 text-sm text-red-600">{errors.house_number.message}</p>
         )}
       </div>

       <div className="md:col-span-2">
         <label className="block text-sm font-medium text-gray-700 mb-2">
           {t('households.form.fields.completeAddress')} *
         </label>
         <textarea
           {...register('complete_address')}
           placeholder={t('households.form.placeholders.completeAddress')}
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