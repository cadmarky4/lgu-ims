import { AuthService } from './auth.service';
import { ResidentsService } from './residents.service';
import { HouseholdsService } from './households.service';
import { DocumentsService } from './documents.service';
import { UsersService } from './users.service';
import { ComplaintsService } from './complaints.service';
import { SuggestionsService } from './suggestions.service';
import { BlotterService } from './blotter.service';
import { AppointmentsService } from './appointments.service';
import { BarangayOfficialsService } from './barangayOfficials.service';

// Create singleton instances
export const authService = new AuthService();
export const residentsService = new ResidentsService();
export const householdsService = new HouseholdsService();
export const documentsService = new DocumentsService();
export const usersService = new UsersService();
export const complaintsService = new ComplaintsService();
export const suggestionsService = new SuggestionsService();
export const blotterService = new BlotterService();
export const appointmentsService = new AppointmentsService();
export const barangayOfficialsService = new BarangayOfficialsService();

// Export service classes for direct instantiation
export {
  AuthService,
  ResidentsService,
  HouseholdsService,
  DocumentsService,
  UsersService,
  ComplaintsService,
  SuggestionsService,
  BlotterService,
  AppointmentsService,
  BarangayOfficialsService
};

// Export all services as a single object for backward compatibility
export const apiService = {
  // Auth
  login: authService.login.bind(authService),
  register: authService.register.bind(authService),
  logout: authService.logout.bind(authService),
  getCurrentUser: authService.getCurrentUser.bind(authService),
  
  // Residents
  getResidents: residentsService.getResidents.bind(residentsService),
  createResident: residentsService.createResident.bind(residentsService),
  updateResident: residentsService.updateResident.bind(residentsService),
  deleteResident: residentsService.deleteResident.bind(residentsService),
  getResidentStatistics: residentsService.getStatistics.bind(residentsService),
  checkDuplicateResident: residentsService.checkDuplicate.bind(residentsService),
    // Households
  getHouseholds: householdsService.getHouseholds.bind(householdsService),
  createHousehold: householdsService.createHousehold.bind(householdsService),
  updateHousehold: householdsService.updateHousehold.bind(householdsService),
  deleteHousehold: householdsService.deleteHousehold.bind(householdsService),
  getHouseholdStatistics: householdsService.getStatistics.bind(householdsService),
  
  // Barangay Officials
  getBarangayOfficials: barangayOfficialsService.getBarangayOfficials.bind(barangayOfficialsService),
  createBarangayOfficial: barangayOfficialsService.createBarangayOfficial.bind(barangayOfficialsService),
  updateBarangayOfficial: barangayOfficialsService.updateBarangayOfficial.bind(barangayOfficialsService),
  deleteBarangayOfficial: barangayOfficialsService.deleteBarangayOfficial.bind(barangayOfficialsService),
  getBarangayOfficialStatistics: barangayOfficialsService.getStatistics.bind(barangayOfficialsService),
};

export default apiService;

