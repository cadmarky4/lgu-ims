import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2, FiSearch, FiEdit2 } from 'react-icons/fi';
import { apiService, residentsService } from '../../../services';
import type { Resident } from '../../../services/residents/residents.types';

interface HouseholdMembersProps {
 householdId: string;
 householdHead: any;
 onMembersUpdate?: (members: any[]) => void;
}

interface MemberResident {
 id: number,
 resident: Resident
 household_id: string,
 resident_id: number
 relationship_to_head: string,
 is_household_head: boolean
}

const HouseholdMembers: React.FC<HouseholdMembersProps> = ({ 
 householdId, 
 householdHead, 
 onMembersUpdate 
}) => {
 const { t } = useTranslation();
 const [members, setMembers] = useState<MemberResident[]>([]);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [showAddMember, setShowAddMember] = useState(false);
 const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
 const [relationship, setRelationship] = useState('');
 const [searchTerm, setSearchTerm] = useState('');
 const [searchResults, setSearchResults] = useState<unknown[]>([]);
 const [isSearching, setIsSearching] = useState(false);

 const relationshipOptions = [
   'SPOUSE',
   'SON',
   'DAUGHTER',
   'FATHER',
   'MOTHER',
   'BROTHER',
   'SISTER',
   'GRANDSON',
   'GRANDDAUGHTER',
   'GRANDFATHER',
   'GRANDMOTHER',
   'UNCLE',
   'AUNT',
   'NEPHEW',
   'NIECE',
   'COUSIN',
   'IN_LAW',
   'OTHER'
 ];

 // Fetch household members
 useEffect(() => {
   fetchMembers();
 }, [householdId]);

 const fetchMembers = async () => {
   if (!householdId) return;
   
   setIsLoading(true);
   setError(null);
   
   try {
     // TODO: Replace with actual API endpoint
     // const response = await apiService.getHouseholdMembers(householdId);
     // setMembers(response);
     
     // Mock data for now
     setMembers([]);
   } catch (err) {
     setError(t('households.form.members.loadError', { defaultValue: 'Failed to load household members' }));
     console.error('Error fetching members:', err);
   } finally {
     setIsLoading(false);
   }
 };

 // Search for residents to add
 const searchResidents = async (term: string) => {
   if (!term.trim()) {
     setSearchResults([]);
     return;
   }

   setIsSearching(true);
   try {
     const results = await residentsService.searchResidents(term);
     
     // Filter out the household head and existing members
     const filteredResults = results.filter((resident: Resident) => 
       resident.id !== householdHead?.id &&
       !members.some((member: any) => member.resident_id === resident.id)
     );
     
     setSearchResults(filteredResults);
   } catch (err) {
     console.error('Error searching residents:', err);
     setSearchResults([]);
   } finally {
     setIsSearching(false);
   }
 };

 // Handle search input change
 useEffect(() => {
   const delayedSearch = setTimeout(() => {
     searchResidents(searchTerm);
   }, 300);

   return () => clearTimeout(delayedSearch);
 }, [searchTerm]);

 const handleAddMember = async () => {
   if (!selectedResident || !relationship) {
     setError(t('households.form.members.selectResidentAndRelationship', { 
       defaultValue: 'Please select a resident and relationship' 
     }));
     return;
   }

   try {
     const memberData = {
       household_id: householdId,
       resident_id: selectedResident.id,
       relationship_to_head: relationship,
       is_household_head: false
     };

     const newMember = {
       id: Date.now(),
       ...memberData,
       resident: selectedResident
     };

     setMembers((prev) => [...prev, newMember]);
     
     setSelectedResident(null);
     setRelationship('');
     setSearchTerm('');
     setSearchResults([]);
     setShowAddMember(false);
     setError(null);

     if (onMembersUpdate) {
       onMembersUpdate([...members, newMember]);
     }

   } catch (err) {
     setError(t('households.form.members.addError', { defaultValue: 'Failed to add household member' }));
     console.error('Error adding member:', err);
   }
 };

 const handleRemoveMember = async (memberId: number) => {
   if (!window.confirm(t('households.form.confirmations.removeMember'))) {
     return;
   }

   try {
     setMembers(prev => prev.filter(member => member.id !== memberId));
     
     if (onMembersUpdate) {
       onMembersUpdate(members.filter(member => member.id !== memberId));
     }

   } catch (err) {
     setError(t('households.form.members.removeError', { defaultValue: 'Failed to remove household member' }));
     console.error('Error removing member:', err);
   }
 };

 return (
   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
     <div className="flex justify-between items-center mb-6">
       <h3 className="text-lg font-semibold text-darktext border-l-4 border-smblue-400 pl-4">
         {t('households.form.members.title')}
       </h3>
       <button
         onClick={() => setShowAddMember(true)}
         className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
       >
         <FiPlus className="w-4 h-4" />
         <span>{t('households.form.members.addMember')}</span>
       </button>
     </div>

     {error && (
       <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
         <p className="text-red-800 text-sm">{error}</p>
       </div>
     )}

     {/* Household Head Display */}
     <div className="bg-blue-50 rounded-lg p-4 mb-4">
       <h4 className="font-medium text-blue-900 mb-2">{t('households.form.members.headOfFamily')}</h4>
       <div className="flex items-center justify-between">
         <div>
           <p className="font-medium text-blue-800">
             {householdHead?.first_name} {householdHead?.last_name}
           </p>
           <p className="text-sm text-blue-600">
             {t('households.form.members.age')}: {householdHead?.age} | {t('households.form.members.gender')}: {householdHead?.gender}
           </p>
         </div>
         <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
           {t('households.relationships.HEAD')}
         </span>
       </div>
     </div>

     {/* Add Member Form */}
     {showAddMember && (
       <div className="bg-gray-50 rounded-lg p-4 mb-4">
         <h4 className="font-medium text-gray-900 mb-4">{t('households.form.members.addNewMember', { defaultValue: 'Add New Member' })}</h4>
         
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               {t('households.form.members.relationshipToHead', { defaultValue: 'Relationship to Household Head' })} *
             </label>
             <select
               value={relationship}
               onChange={(e) => setRelationship(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
               required
             >
               <option value="">{t('households.form.options.selectRelationship')}</option>
               {relationshipOptions.map((option) => (
                 <option key={option} value={option}>
                   {t(`households.relationships.${option}`)}
                 </option>
               ))}
             </select>
           </div>

           <div className="flex space-x-3">
             <button
               onClick={handleAddMember}
               disabled={!relationship}
               className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {t('households.form.members.addMember')}
             </button>
             <button
               onClick={() => {
                 setShowAddMember(false);
                 setRelationship('');
                 setError(null);
               }}
               className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
             >
               {t('households.form.actions.cancel')}
             </button>
           </div>
         </div>
       </div>
     )}

     {/* Members Table */}
     {members.length === 0 ? (
       <div className="text-center py-8">
         <p className="text-gray-600">{t('households.form.members.noMembers')}</p>
         <p className="text-sm text-gray-500 mt-1">{t('households.form.members.noMembersDescription', { defaultValue: 'Click "Add Member" to start adding family members.' })}</p>
       </div>
     ) : (
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead>
             <tr className="border-b border-gray-200">
               <th className="text-left py-3 px-4 font-medium text-gray-700">{t('households.form.members.memberName', { defaultValue: 'Name' })}</th>
               <th className="text-left py-3 px-4 font-medium text-gray-700">{t('households.form.members.relationship')}</th>
               <th className="text-left py-3 px-4 font-medium text-gray-700">{t('households.form.members.actions')}</th>
             </tr>
           </thead>
           <tbody>
             {members.map((member) => (
               <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                 <td className="py-3 px-4">
                   <p className="font-medium text-gray-900">
                     {member.resident?.first_name} {member.resident?.last_name}
                   </p>
                 </td>
                 <td className="py-3 px-4 text-gray-700">
                   {t(`households.relationships.${member.relationship_to_head}`, { 
                     defaultValue: member.relationship_to_head 
                   })}
                 </td>
                 <td className="py-3 px-4">
                   <button
                     onClick={() => handleRemoveMember(member.id)}
                     className="text-red-600 hover:text-red-800"
                     title={t('households.form.members.removeMember')}
                   >
                     <FiTrash2 className="w-4 h-4" />
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     )}
   </div>
 );
};

export default HouseholdMembers;