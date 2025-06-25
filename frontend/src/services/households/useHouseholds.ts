// ============================================================================
// hooks/households/use-households.ts - TanStack Query hooks
// ============================================================================

import { 
    useQuery, 
    useMutation, 
    useQueryClient, 
    useInfiniteQuery 
  } from '@tanstack/react-query';
  import type { Household, HouseholdParams, HouseholdFormData } from './households.types';
  import { householdsService } from '@/services/households/households.service';
  
  // Query keys
  export const householdsKeys = {
    all: ['households'] as const,
    lists: () => [...householdsKeys.all, 'list'] as const,
    list: (params: HouseholdParams) => [...householdsKeys.lists(), params] as const,
    details: () => [...householdsKeys.all, 'detail'] as const,
    detail: (id: number) => [...householdsKeys.details(), id] as const,
    statistics: () => [...householdsKeys.all, 'statistics'] as const,
    search: (term: string) => [...householdsKeys.all, 'search', term] as const,
    specialLists: () => [...householdsKeys.all, 'specialLists'] as const,
    fourPs: (barangay?: string) => [...householdsKeys.specialLists(), 'fourPs', barangay] as const,
    withSeniorCitizens: (barangay?: string) => [...householdsKeys.specialLists(), 'withSeniorCitizens', barangay] as const,
    withPWD: (barangay?: string) => [...householdsKeys.specialLists(), 'withPWD', barangay] as const,
    byType: (householdType: string, barangay?: string) => [...householdsKeys.specialLists(), 'byType', householdType, barangay] as const,
    byOwnership: (ownershipStatus: string, barangay?: string) => [...householdsKeys.specialLists(), 'byOwnership', ownershipStatus, barangay] as const,
    byBarangay: (barangay: string) => [...householdsKeys.all, 'byBarangay', barangay] as const,
    byHead: (headResidentId: number) => [...householdsKeys.all, 'byHead', headResidentId] as const,
  };
  
  // Queries
  export function useHouseholds(params: HouseholdParams = {}) {
    return useQuery({
      queryKey: householdsKeys.list(params),
      queryFn: () => householdsService.getHouseholds(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }
  
  export function useHousehold(id: number, enabled = true) {
    return useQuery({
      queryKey: householdsKeys.detail(id),
      queryFn: () => householdsService.getHousehold(id),
      enabled: enabled && !!id && id > 0,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
  
  export function useHouseholdStatistics() {
    return useQuery({
      queryKey: householdsKeys.statistics(),
      queryFn: () => householdsService.getStatistics(),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  }
  
  export function useHouseholdSearch(searchTerm: string, enabled = true) {
    return useQuery({
      queryKey: householdsKeys.search(searchTerm),
      queryFn: () => householdsService.searchHouseholds(searchTerm),
      enabled: enabled && searchTerm.trim().length >= 2,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  }
  
  export function useCheckHouseholdDuplicate(completeAddress: string, headResidentId?: number, enabled = true) {
    return useQuery({
      queryKey: ['households', 'checkDuplicate', completeAddress, headResidentId],
      queryFn: () => householdsService.checkDuplicate(completeAddress, headResidentId),
      enabled: enabled && completeAddress.trim().length >= 3,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  }
  
//   export function useHouseholdsByBarangay(barangay: string, enabled = true) {
//     return useQuery({
//       queryKey: householdsKeys.byBarangay(barangay),
//       queryFn: () => householdsService.getHouseholdsByBarangay(barangay),
//       enabled: enabled && !!barangay.trim(),
//       staleTime: 10 * 60 * 1000, // 10 minutes
//     });
//   }
  
  export function useHouseholdsByHead(headResidentId: number, enabled = true) {
    return useQuery({
      queryKey: householdsKeys.byHead(headResidentId),
      queryFn: () => householdsService.getHouseholdsByHead(headResidentId),
      enabled: enabled && !!headResidentId && headResidentId > 0,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
  
  // Special lists
  export function useFourPsHouseholds(barangay?: string) {
    return useQuery({
      queryKey: householdsKeys.fourPs(barangay),
      queryFn: () => householdsService.getFourPsHouseholds(barangay),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
  
  export function useHouseholdsWithSeniorCitizens(barangay?: string) {
    return useQuery({
      queryKey: householdsKeys.withSeniorCitizens(barangay),
      queryFn: () => householdsService.getHouseholdsWithSeniorCitizens(barangay),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
  
  export function useHouseholdsWithPWD(barangay?: string) {
    return useQuery({
      queryKey: householdsKeys.withPWD(barangay),
      queryFn: () => householdsService.getHouseholdsWithPWD(barangay),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
  
  export function useHouseholdsByType(householdType: string, barangay?: string, enabled = true) {
    return useQuery({
      queryKey: householdsKeys.byType(householdType, barangay),
      queryFn: () => householdsService.getHouseholdsByType(householdType, barangay),
      enabled: enabled && !!householdType.trim(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
  
  export function useHouseholdsByOwnership(ownershipStatus: string, barangay?: string, enabled = true) {
    return useQuery({
      queryKey: householdsKeys.byOwnership(ownershipStatus, barangay),
      queryFn: () => householdsService.getHouseholdsByOwnership(ownershipStatus, barangay),
      enabled: enabled && !!ownershipStatus.trim(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }
  
  // Mutations
  export function useCreateHousehold() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: HouseholdFormData) => householdsService.createHousehold(data),
      onSuccess: (newHousehold: Household) => {
        queryClient.invalidateQueries({ queryKey: householdsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: householdsKeys.statistics() });
        queryClient.setQueryData(
          householdsKeys.detail(newHousehold.id),
          newHousehold
        );
      },
      onError: (error: any) => {
      },
    });
  }
  
  export function useUpdateHousehold() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: HouseholdFormData }) =>
        householdsService.updateHousehold(id, data),
      onSuccess: (updatedHousehold: Household) => {
        queryClient.invalidateQueries({ queryKey: householdsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: householdsKeys.statistics() });
        queryClient.setQueryData(
          householdsKeys.detail(updatedHousehold.id),
          updatedHousehold
        );
      },
      onError: (error: any) => {
      },
    });
  }
  
  export function useDeleteHousehold() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: number) => householdsService.deleteHousehold(id),
      onSuccess: (_, deletedId) => {
        queryClient.invalidateQueries({ queryKey: householdsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: householdsKeys.statistics() });
        queryClient.removeQueries({ queryKey: householdsKeys.detail(deletedId) });
      },
      onError: (error: any) => {
      },
    });
  }
  
  export function useUpdateHouseholdMembers() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ householdId, memberIds }: { 
        householdId: number; 
        memberIds: Array<{resident_id: number, relationship: string}>
      }) =>
        householdsService.updateHouseholdMembers(householdId, memberIds),
      onSuccess: (updatedHousehold: Household) => {
        queryClient.invalidateQueries({ queryKey: householdsKeys.lists() });
        queryClient.setQueryData(
          householdsKeys.detail(updatedHousehold.id),
          updatedHousehold
        );
      },
      onError: (error: any) => {
      },
    });
  }
  
  // Infinite query for large datasets
  export function useInfiniteHouseholds(params: Omit<HouseholdParams, 'page'> = {}) {
    return useInfiniteQuery({
      queryKey: ['households', 'infinite', params],
      queryFn: ({ pageParam = 1 }) =>
        householdsService.getHouseholds({ ...params, page: pageParam }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.last_page) {
          return lastPage.current_page + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }
  
  // Export all hooks for easier imports