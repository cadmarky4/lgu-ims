// ============================================================================
// components/residents/form/ResidentForm.tsx - Main form component
// ============================================================================

import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';
import { useResidentForm } from '../_hooks/useResidentsForm';
import { ResidentFormSection } from './ResidentFormSection';
import { ResidentFormField } from './ResidentFormField';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { DuplicateWarning } from './DuplicateWarning';
import { LoadingSpinner } from '@/components/__shared/LoadingSpinner';

interface ResidentFormProps {
  mode: 'create' | 'edit';
  residentId?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

export const ResidentForm: React.FC<ResidentFormProps> = ({
  mode,
  residentId,
  onClose,
  onSuccess
}) => {
  const { t } = useTranslation();



  const [provinceOptions, setProvinceOptions] = useState<SelectOption[]>([]);
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<SelectOption[]>([]);



  const {
    form,
    isLoadingResident,
    profilePhotoPreview,
    duplicateWarning,
    isSubmitting,
    isUploadingFile,
    handleSubmit,
    handleFileUpload,
    saveDraft,
    clearDraft,
  } = useResidentForm({ mode, residentId, onSuccess });

  if (isLoadingResident && mode === 'edit') {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <span className="ml-2 text-gray-600">
          {t('residents.form.messages.loadingResident')}
        </span>
      </div>
    );
  }

  const title = mode === 'create'
    ? t('residents.form.addTitle')
    : t('residents.form.editTitle');

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-darktext">{title}</h1>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title={t('residents.form.actions.close')}
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <DuplicateWarning message={duplicateWarning} />
      )}

      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          {/* Basic Information */}
          <ResidentFormSection title={t('residents.form.sections.basicInfo')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ResidentFormField
                name="first_name"
                label={t('residents.form.fields.firstName')}
                placeholder={t('residents.form.placeholders.firstName')}
                required
              />
              <ResidentFormField
                name="last_name"
                label={t('residents.form.fields.lastName')}
                placeholder={t('residents.form.placeholders.lastName')}
                required
              />
              <ResidentFormField
                name="middle_name"
                label={t('residents.form.fields.middleName')}
                placeholder={t('residents.form.placeholders.middleName')}
              />
              <ResidentFormField
                name="suffix"
                label={t('residents.form.fields.suffix')}
                type="select"
                placeholder={t('residents.form.options.selectSuffix')}
                options={[
                  { value: 'Jr.', label: 'Jr.' },
                  { value: 'Sr.', label: 'Sr.' },
                  { value: 'II', label: 'II' },
                  { value: 'III', label: 'III' },
                  { value: 'IV', label: 'IV' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ResidentFormField
                name="birth_date"
                label={t('residents.form.fields.birthDate')}
                type="date"
                required
              />
              <ResidentFormField
                name="age"
                label={t('residents.form.fields.age')}
                type="number"
                readOnly
              />
              <ResidentFormField
                name="birth_place"
                label={t('residents.form.fields.birthPlace')}
                placeholder={t('residents.form.placeholders.birthPlace')}
                required
              />
              <ResidentFormField
                name="gender"
                label={t('residents.form.fields.gender')}
                type="select"
                placeholder={t('residents.form.options.selectGender')}
                required
                options={[
                  { value: 'MALE', label: t('residents.form.genderOptions.male') },
                  { value: 'FEMALE', label: t('residents.form.genderOptions.female') },
                  { value: 'NON_BINARY', label: t('residents.form.genderOptions.nonBinary') },
                  { value: 'PREFER_NOT_TO_SAY', label: t('residents.form.genderOptions.preferNotToSay') },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResidentFormField
                name="civil_status"
                label={t('residents.form.fields.civilStatus')}
                type="select"
                placeholder={t('residents.form.options.selectCivilStatus')}
                required
                options={[
                  { value: 'SINGLE', label: t('residents.form.civilStatusOptions.single') },
                  { value: 'LIVE_IN', label: t('residents.form.civilStatusOptions.liveIn') },
                  { value: 'MARRIED', label: t('residents.form.civilStatusOptions.married') },
                  { value: 'WIDOWED', label: t('residents.form.civilStatusOptions.widowed') },
                  { value: 'DIVORCED', label: t('residents.form.civilStatusOptions.divorced') },
                  { value: 'SEPARATED', label: t('residents.form.civilStatusOptions.separated') },
                  { value: 'ANNULLED', label: t('residents.form.civilStatusOptions.annulled') },
                  { value: 'PREFER_NOT_TO_SAY', label: t('residents.form.civilStatusOptions.preferNotToSay') },
                ]}
              />
              <ResidentFormField
                name="nationality"
                label={t('residents.form.fields.nationality')}
                type="select"
                placeholder={t('residents.form.placeholders.nationality')}
                required
                options={[
                  { value: 'FILIPINO', label: 'Filipino' },
                  { value: 'FOREIGN', label: 'Foreign' },
                ]}
              />
              <ResidentFormField
                name="religion"
                label={t('residents.form.fields.religion')}
                type="select"
                placeholder={t('residents.form.placeholders.religion')}
                required
                options={[
                  { value: 'CATHOLIC', label: t('residents.form.religionOptions.catholic') },
                  { value: 'IGLESIA_NI_CRISTO', label: t('residents.form.religionOptions.iglesiaNiCristo') },
                  { value: 'EVANGELICAL', label: t('residents.form.religionOptions.evangelical') },
                  { value: 'PROTESTANT', label: t('residents.form.religionOptions.protestant') },
                  { value: 'ISLAM', label: t('residents.form.religionOptions.islam') },
                  { value: 'BUDDHIST', label: t('residents.form.religionOptions.buddhist') },
                  { value: 'HINDU', label: t('residents.form.religionOptions.hindu') },
                  { value: 'SEVENTH_DAY_ADVENTIST', label: t('residents.form.religionOptions.seventhDayAdventist') },
                  { value: 'JEHOVAHS_WITNESS', label: t('residents.form.religionOptions.jehovahsWitness') },
                  { value: 'BORN_AGAIN_CHRISTIAN', label: t('residents.form.religionOptions.bornAgainChristian') },
                  { value: 'ORTHODOX', label: t('residents.form.religionOptions.orthodox') },
                  { value: 'JUDAISM', label: t('residents.form.religionOptions.judaism') },
                  { value: 'ATHEIST', label: t('residents.form.religionOptions.atheist') },
                  { value: 'AGLIPAYAN', label: t('residents.form.religionOptions.aglipayan') },
                  { value: 'OTHER', label: t('residents.form.options.other') },
                  { value: 'PREFER_NOT_TO_SAY', label: t('residents.form.religionOptions.preferNotToSay') },
                ]}
              />
            </div>
          </ResidentFormSection>

          {/* Employment and Education */}
          <ResidentFormSection title={t('residents.form.sections.employmentEducation')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ResidentFormField
                name="educational_attainment"
                label={t('residents.form.fields.educationalAttainment')}
                type="select"
                placeholder={t('residents.form.options.selectEducationalAttainment')}
                options={[
                  { value: 'NO_FORMAL_EDUCATION', label: t('residents.form.educationalAttainmentOptions.noFormalEducation') },
                  { value: 'ELEMENTARY_UNDERGRADUATE', label: t('residents.form.educationalAttainmentOptions.elementaryUndergraduate') },
                  { value: 'ELEMENTARY_GRADUATE', label: t('residents.form.educationalAttainmentOptions.elementaryGraduate') },
                  { value: 'HIGH_SCHOOL_UNDERGRADUATE', label: t('residents.form.educationalAttainmentOptions.highSchoolUndergraduate') },
                  { value: 'HIGH_SCHOOL_GRADUATE', label: t('residents.form.educationalAttainmentOptions.highSchoolGraduate') },
                  { value: 'COLLEGE_UNDERGRADUATE', label: t('residents.form.educationalAttainmentOptions.collegeUndergraduate') },
                  { value: 'COLLEGE_GRADUATE', label: t('residents.form.educationalAttainmentOptions.collegeGraduate') },
                  { value: 'POST_GRADUATE', label: t('residents.form.educationalAttainmentOptions.postGraduate') },
                  { value: 'VOCATIONAL', label: t('residents.form.educationalAttainmentOptions.vocational') },
                  { value: 'OTHER', label: t('residents.form.options.other') },
                ]}
              />

              <ResidentFormField
                name="employment_status"
                label={t('residents.form.fields.employmentStatus')}
                type="select"
                placeholder={t('residents.form.options.selectEmploymentStatus')}
                options={[
                  { value: 'EMPLOYED', label: t('residents.form.employmentStatusOptions.employed') },
                  { value: 'UNEMPLOYED', label: t('residents.form.employmentStatusOptions.unemployed') },
                  { value: 'SELF_EMPLOYED', label: t('residents.form.employmentStatusOptions.selfEmployed') },
                  { value: 'RETIRED', label: t('residents.form.employmentStatusOptions.retired') },
                  { value: 'STUDENT', label: t('residents.form.employmentStatusOptions.student') },
                  { value: 'OFW', label: t('residents.form.employmentStatusOptions.overseasWorker') },
                ]}
              />

              <ResidentFormField
                name="occupation"
                label={t('residents.form.fields.occupation')}
                placeholder={t('residents.form.placeholders.occupation')}
              />

              <ResidentFormField
                name="employer"
                label={t('residents.form.fields.employer')}
                placeholder={t('residents.form.placeholders.employer')}
              />
            </div>
          </ResidentFormSection>

          {/* Contact Information */}
          <ResidentFormSection title={t('residents.form.sections.contactInfo')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ResidentFormField
                name="mobile_number"
                label={t('residents.form.fields.mobileNumber')}
                type="tel"
                placeholder={t('residents.form.placeholders.mobileNumber')}
              />
              <ResidentFormField
                name="landline_number"
                label={t('residents.form.fields.landlineNumber')}
                type="tel"
                placeholder={t('residents.form.placeholders.landlineNumber')}
              />
              <div className="md:col-span-2">
                <ResidentFormField
                  name="email_address"
                  label={t('residents.form.fields.emailAddress')}
                  type="email"
                  placeholder={t('residents.form.placeholders.emailAddress')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ResidentFormField
                name="region"
                label={t('residents.form.fields.region')}
                type="select"
                placeholder={t('residents.form.placeholders.region')}
                required
                options={[]} // Populate with region options
              />
              <ResidentFormField
                name="province"
                label={t('residents.form.fields.province')}
                type="select"
                placeholder={t('residents.form.placeholders.province')}
                required
                options={[]} // Populate with province options
                disabled={!form.watch('region')}
              />
              <ResidentFormField
                name="city"
                label={t('residents.form.fields.city')}
                type="select"
                placeholder={t('residents.form.placeholders.city')}
                required
                options={[]} // Populate with city options
                disabled={!form.watch('province')}
              />
              <ResidentFormField
                name="barangay"
                label={t('residents.form.fields.barangay')}
                type="select"
                placeholder={t('residents.form.placeholders.barangay')}
                required
                options={[]} // Populate with barangay options
                disabled={!form.watch('city')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ResidentFormField
                name="street_address"
                label={t('residents.form.fields.streetAddress')}
                placeholder={t('residents.form.placeholders.streetAddress')}
              />
            </div>

            <ResidentFormField
              name="complete_address"
              label={t('residents.form.fields.completeAddress')}
              type="textarea"
              placeholder={t('residents.form.placeholders.completeAddress')}
              required
            />
          </ResidentFormSection>

          {/* Family Information */}
          <ResidentFormSection title={t('residents.form.sections.familyInfo')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ResidentFormField
                name="mother_name"
                label={t('residents.form.fields.motherName')}
                placeholder={t('residents.form.placeholders.motherName')}
              />
              <ResidentFormField
                name="father_name"
                label={t('residents.form.fields.fatherName')}
                placeholder={t('residents.form.placeholders.fatherName')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResidentFormField
                name="emergency_contact_name"
                label={t('residents.form.fields.emergencyContactName')}
                placeholder={t('residents.form.placeholders.emergencyContactName')}
              />
              <ResidentFormField
                name="emergency_contact_number"
                label={t('residents.form.fields.emergencyContactNumber')}
                type="tel"
                placeholder={t('residents.form.placeholders.emergencyContactNumber')}
              />
              <div className="md:col-span-2">
                <ResidentFormField
                  name="emergency_contact_relationship"
                  label={t('residents.form.fields.emergencyContactRelationship')}
                  placeholder={t('residents.form.placeholders.emergencyContactRelationship')}
                />
              </div>
            </div>
          </ResidentFormSection>

          {/* Profile Photo */}
          <ResidentFormSection title={t('residents.form.sections.profilePhoto')}>
            <ProfilePhotoUpload
              preview={profilePhotoPreview}
              onFileSelect={handleFileUpload}
              isUploading={isUploadingFile}
            />
          </ResidentFormSection>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {mode === 'create' && (
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>{t('residents.form.actions.saveDraft')}</span>
              </button>
            )}

            {mode === 'create' && (
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>{t('residents.form.actions.clearDraft')}</span>
              </button>
            )}

            <div className={`flex space-x-4 ${mode === 'edit' ? 'w-full justify-end' : ''}`}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('residents.form.actions.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>
                  {isSubmitting
                    ? (mode === 'create'
                      ? t('residents.form.actions.registering')
                      : t('residents.form.actions.updating'))
                    : (mode === 'create'
                      ? t('residents.form.actions.register')
                      : t('residents.form.actions.update'))
                  }
                </span>
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </main>
  );
};