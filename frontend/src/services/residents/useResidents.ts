// ============================================================================
// hooks/residents/use-residents.ts - TanStack Query hooks
// ============================================================================

import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery 
} from '@tanstack/react-query';
import type { Resident, ResidentParams } from './residents.types';
import { residentsService } from '@/services/residents/residents.service';
import type { ResidentFormData } from './residents-form.types';

// Query keys
export const residentsKeys = {
  all: ['residents'] as const,
  lists: () => [...residentsKeys.all, 'list'] as const,
  list: (params: ResidentParams) => [...residentsKeys.lists(), params] as const,
  details: () => [...residentsKeys.all, 'detail'] as const,
  detail: (id: number) => [...residentsKeys.details(), id] as const,
  statistics: () => [...residentsKeys.all, 'statistics'] as const,
  ageGroups: () => [...residentsKeys.all, 'ageGroups'] as const,
  search: (term: string) => [...residentsKeys.all, 'search', term] as const,
  specialLists: () => [...residentsKeys.all, 'specialLists'] as const,
  seniorCitizens: (purok?: string) => [...residentsKeys.specialLists(), 'seniors', purok] as const,
  pwd: (purok?: string) => [...residentsKeys.specialLists(), 'pwd', purok] as const,
  fourPs: (purok?: string) => [...residentsKeys.specialLists(), 'fourPs', purok] as const,
  householdHeads: (purok?: string) => [...residentsKeys.specialLists(), 'householdHeads', purok] as const,
};

// Queries
export function useResidents(params: ResidentParams = {}) {
  return useQuery({
    queryKey: residentsKeys.list(params),
    queryFn: () => residentsService.getResidents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useResident(id: number, enabled = true) {
  return useQuery({
    queryKey: residentsKeys.detail(id),
    queryFn: () => residentsService.getResident(id),
    enabled: enabled && !!id && id > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useResidentStatistics() {
  return useQuery({
    queryKey: residentsKeys.statistics(),
    queryFn: () => residentsService.getStatistics(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useAgeGroupStatistics() {
  return useQuery({
    queryKey: residentsKeys.ageGroups(),
    queryFn: () => residentsService.getAgeGroupStatistics(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useResidentSearch(searchTerm: string, enabled = true) {
  return useQuery({
    queryKey: residentsKeys.search(searchTerm),
    queryFn: () => residentsService.searchResidents(searchTerm),
    enabled: enabled && searchTerm.trim().length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Special lists
export function useSeniorCitizens(purok?: string) {
  return useQuery({
    queryKey: residentsKeys.seniorCitizens(purok),
    queryFn: () => residentsService.getSeniorCitizens(purok),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePWD(purok?: string) {
  return useQuery({
    queryKey: residentsKeys.pwd(purok),
    queryFn: () => residentsService.getPWD(purok),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFourPs(purok?: string) {
  return useQuery({
    queryKey: residentsKeys.fourPs(purok),
    queryFn: () => residentsService.getFourPs(purok),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useHouseholdHeads(purok?: string) {
  return useQuery({
    queryKey: residentsKeys.householdHeads(purok),
    queryFn: () => residentsService.getHouseholdHeads(purok),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutations
export function useCreateResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResidentFormData) => residentsService.createResident(data),
    onSuccess: (newResident: Resident) => {
      queryClient.invalidateQueries({ queryKey: residentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: residentsKeys.statistics() });
      queryClient.setQueryData(
        residentsKeys.detail(newResident.id),
        newResident
      );
    },
    onError: (error: any) => {
    },
  });
}

export function useUpdateResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResidentFormData }) =>
      residentsService.updateResident(id, data),
    onSuccess: (updatedResident: Resident) => {
      queryClient.invalidateQueries({ queryKey: residentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: residentsKeys.statistics() });
      queryClient.setQueryData(
        residentsKeys.detail(updatedResident.id),
        updatedResident
      );
    },
    onError: (error: any) => {
    },
  });
}

export function useDeleteResident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => residentsService.deleteResident(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: residentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: residentsKeys.statistics() });
      queryClient.removeQueries({ queryKey: residentsKeys.detail(deletedId) });
    },
    onError: (error: any) => {
    },
  });
}

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photo }: { id: number; photo: File }) =>
      residentsService.uploadProfilePhoto(id, photo),
    onSuccess: (updatedResident: Resident) => {
      queryClient.setQueryData(
        residentsKeys.detail(updatedResident.id),
        updatedResident
      );
      queryClient.invalidateQueries({ queryKey: residentsKeys.lists() });
    },
    onError: (error: any) => {
    },
  });
}

// Infinite query for large datasets
export function useInfiniteResidents(params: Omit<ResidentParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['residents', 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      residentsService.getResidents({ ...params, page: pageParam }),
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