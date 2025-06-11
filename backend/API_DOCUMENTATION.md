# LGU Information Management System - Backend API Documentation

## Overview
This document outlines all the backend API endpoints implemented for the LGU Information Management System based on the frontend features.

## API Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except public ones) require JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

---

## 1. RESIDENTS MODULE

### Endpoints

#### Create Resident
- **POST** `/residents`
- **Description**: Create a new resident profile
- **Access**: Admin, Barangay Captain, Secretary, Staff
- **Body**: 
```json
{
  "firstName": "string",
  "lastName": "string", 
  "middleName": "string?",
  "suffix": "string?",
  "birthDate": "string (ISO date)",
  "age": "number",
  "gender": "MALE | FEMALE | OTHER",
  "civilStatus": "SINGLE | MARRIED | DIVORCED | WIDOWED | SEPARATED",
  "religion": "string?",
  "nationality": "string?",
  "placeOfBirth": "string?",
  "houseNumber": "string?",
  "street": "string?",
  "purok": "string?",
  "completeAddress": "string",
  "mobileNumber": "string?",
  "landlineNumber": "string?",
  "emailAddress": "string?",
  "motherName": "string?",
  "fatherName": "string?",
  "emergencyContactName": "string?",
  "emergencyContactNumber": "string?",
  "primaryIdType": "string?",
  "idNumber": "string?",
  "philsysNumber": "string?",
  "tin": "string?",
  "seniorCitizen": "boolean?",
  "personWithDisability": "boolean?",
  "soloParent": "boolean?",
  "fourPsBeneficiary": "boolean?",
  "indigent": "boolean?",
  "ofw": "boolean?",
  "isHouseholdHead": "boolean?",
  "householdId": "string?"
}
```

#### Get All Residents
- **GET** `/residents`
- **Description**: Get paginated list of residents with filtering
- **Access**: All authenticated users
- **Query Parameters**:
  - `search`: Search by name, address, contact
  - `gender`: Filter by gender
  - `civilStatus`: Filter by civil status
  - `purok`: Filter by purok
  - `seniorCitizen`: Filter senior citizens
  - `personWithDisability`: Filter PWD members
  - `fourPsBeneficiary`: Filter 4Ps beneficiaries
  - `isHouseholdHead`: Filter household heads
  - `sortBy`: Sort field
  - `sortOrder`: asc | desc
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

#### Get Resident by ID
- **GET** `/residents/:id`
- **Description**: Get specific resident details
- **Access**: All authenticated users

#### Update Resident
- **PATCH** `/residents/:id`
- **Description**: Update resident information
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Delete Resident
- **DELETE** `/residents/:id`
- **Description**: Delete resident record
- **Access**: Admin, Barangay Captain

#### Search Residents
- **GET** `/residents/search?q={query}`
- **Description**: Search residents for quick lookup
- **Access**: All authenticated users

#### Get Household Heads
- **GET** `/residents/household-heads`
- **Description**: Get all residents who are household heads
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Get Resident Statistics
- **GET** `/residents/statistics`
- **Description**: Get statistical summary of residents
- **Access**: Admin, Barangay Captain, Secretary, Staff

---

## 2. HOUSEHOLDS MODULE

### Endpoints

#### Create Household
- **POST** `/households`
- **Description**: Create a new household profile
- **Access**: Admin, Barangay Captain, Secretary, Staff
- **Body**:
```json
{
  "householdType": "string?",
  "barangay": "string",
  "streetSitio": "string?",
  "houseNumber": "string?",
  "completeAddress": "string",
  "headId": "string",
  "monthlyIncome": "number?",
  "primaryIncomeSource": "string?",
  "houseType": "CONCRETE | WOOD | MIXED | BAMBOO | OTHER",
  "ownershipStatus": "OWNED | RENTED | FREE_USE | OTHER",
  "fourPsBeneficiary": "boolean?",
  "indigentFamily": "boolean?",
  "hasSeniorCitizen": "boolean?",
  "hasPwdMember": "boolean?"
}
```

#### Get All Households
- **GET** `/households`
- **Description**: Get paginated list of households with filtering
- **Access**: All authenticated users
- **Query Parameters**: Similar to residents with household-specific filters

#### Get Household by ID
- **GET** `/households/:id`
- **Description**: Get specific household details with members
- **Access**: All authenticated users

#### Update Household
- **PATCH** `/households/:id`
- **Description**: Update household information
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Delete Household
- **DELETE** `/households/:id`
- **Description**: Delete household record
- **Access**: Admin, Barangay Captain

#### Get Household Statistics
- **GET** `/households/statistics`
- **Description**: Get statistical summary of households
- **Access**: Admin, Barangay Captain, Secretary, Staff

---

## 3. DOCUMENTS MODULE

### Endpoints

#### Create Document Request
- **POST** `/documents`
- **Description**: Create a new document request
- **Access**: Admin, Barangay Captain, Secretary, Staff
- **Body**:
```json
{
  "documentType": "BARANGAY_CLEARANCE | BUSINESS_PERMIT | CERTIFICATE_OF_INDIGENCY | CERTIFICATE_OF_RESIDENCY | CERTIFICATE_OF_EMPLOYMENT | CERTIFICATE_OF_LOW_INCOME",
  "residentId": "string",
  "purposeOfRequest": "string",
  "validIdPresented": "string?",
  "yearsOfResidency": "string?",
  "certifyingOfficial": "string",
  "businessName": "string?",
  "businessType": "string?",
  "businessAddress": "string?"
}
```

#### Get All Documents
- **GET** `/documents`
- **Description**: Get paginated list of document requests
- **Access**: All authenticated users
- **Query Parameters**:
  - `search`: Search by document number, purpose, resident name
  - `documentType`: Filter by document type
  - `status`: Filter by status
  - `residentId`: Filter by resident
  - `certifyingOfficial`: Filter by official
  - `dateFrom`: Date range start
  - `dateTo`: Date range end
  - Pagination and sorting parameters

#### Get Document by ID
- **GET** `/documents/:id`
- **Description**: Get specific document details
- **Access**: All authenticated users

#### Get Document by Number
- **GET** `/documents/number/:documentNumber`
- **Description**: Get document by document number
- **Access**: All authenticated users

#### Update Document
- **PATCH** `/documents/:id`
- **Description**: Update document information
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Update Document Status
- **PATCH** `/documents/:id/status`
- **Description**: Update document processing status
- **Access**: Admin, Barangay Captain, Secretary, Staff
- **Body**:
```json
{
  "status": "PENDING | IN_PROGRESS | APPROVED | REJECTED | COMPLETED",
  "notes": "string?"
}
```

#### Delete Document
- **DELETE** `/documents/:id`
- **Description**: Delete document record
- **Access**: Admin, Barangay Captain

#### Get Documents by Resident
- **GET** `/documents/resident/:residentId`
- **Description**: Get all documents for a specific resident
- **Access**: All authenticated users

#### Get Document Statistics
- **GET** `/documents/statistics`
- **Description**: Get statistical summary of documents
- **Access**: Admin, Barangay Captain, Secretary, Staff

---

## 4. PROJECTS MODULE

### Endpoints

#### Create Project
- **POST** `/projects`
- **Description**: Create a new project
- **Access**: Admin, Barangay Captain, Secretary
- **Body**:
```json
{
  "projectName": "string",
  "category": "INFRASTRUCTURE | HEALTH | EDUCATION | ENVIRONMENT | SOCIAL_SERVICES | ECONOMIC_DEVELOPMENT | DISASTER_PREPAREDNESS | OTHER",
  "projectDescription": "string",
  "startDate": "string (ISO date)",
  "endDate": "string (ISO date)",
  "priorityLevel": "LOW | MEDIUM | HIGH | URGENT",
  "totalBudget": "number",
  "fundingSource": "string",
  "materialSupplies": "number?",
  "laborServices": "number?",
  "equipment": "number?",
  "projectManager": "string",
  "expectedBeneficiaries": "string?",
  "teamDepartment": "string?",
  "keyStakeholders": "string?",
  "projectLocation": "string?",
  "successMetrics": "string?",
  "potentialRisks": "string?",
  "milestones": [
    {
      "description": "string",
      "targetDate": "string (ISO date)"
    }
  ],
  "teamMemberIds": ["string"]
}
```

#### Get All Projects
- **GET** `/projects`
- **Description**: Get paginated list of projects
- **Access**: All authenticated users

#### Get Project by ID
- **GET** `/projects/:id`
- **Description**: Get specific project details with milestones and team
- **Access**: All authenticated users

#### Update Project
- **PATCH** `/projects/:id`
- **Description**: Update project information
- **Access**: Admin, Barangay Captain, Secretary

#### Delete Project
- **DELETE** `/projects/:id`
- **Description**: Delete project record
- **Access**: Admin, Barangay Captain

#### Get Project Statistics
- **GET** `/projects/statistics`
- **Description**: Get statistical summary of projects
- **Access**: Admin, Barangay Captain, Secretary, Staff

---

## 5. BARANGAY OFFICIALS MODULE

### Endpoints

#### Create Official
- **POST** `/officials`
- **Description**: Create a new barangay official record
- **Access**: Admin, Barangay Captain
- **Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "middleName": "string?",
  "position": "BARANGAY_CAPTAIN | BARANGAY_SECRETARY | BARANGAY_TREASURER | KAGAWAD | SK_CHAIRPERSON | SK_KAGAWAD",
  "committee": "HEALTH | EDUCATION | INFRASTRUCTURE | PEACE_AND_ORDER | ENVIRONMENT | SOCIAL_SERVICES | SPORTS_AND_RECREATION | SENIOR_CITIZEN | WOMEN_AND_FAMILY",
  "contact": "string?",
  "email": "string?",
  "termStart": "string (ISO date)",
  "termEnd": "string (ISO date)",
  "nationality": "string?",
  "photo": "string?"
}
```

#### Get All Officials
- **GET** `/officials`
- **Description**: Get paginated list of barangay officials
- **Access**: All authenticated users

#### Get Official by ID
- **GET** `/officials/:id`
- **Description**: Get specific official details
- **Access**: All authenticated users

#### Update Official
- **PATCH** `/officials/:id`
- **Description**: Update official information
- **Access**: Admin, Barangay Captain

#### Delete Official
- **DELETE** `/officials/:id`
- **Description**: Delete official record
- **Access**: Admin, Barangay Captain

#### Get Active Officials
- **GET** `/officials/active`
- **Description**: Get all currently active officials
- **Access**: All authenticated users

---

## 6. HELP DESK MODULE

### 6.1 COMPLAINTS

#### Create Complaint
- **POST** `/helpdesk/complaints`
- **Description**: File a new complaint
- **Access**: All authenticated users
- **Body**:
```json
{
  "complainantName": "string",
  "complainantContact": "string?",
  "complainantAddress": "string?",
  "complaintType": "NOISE_COMPLAINT | PROPERTY_DISPUTE | HARASSMENT | VIOLENCE | THEFT | VANDALISM | PUBLIC_DISTURBANCE | UTILITY_ISSUES | SANITATION | OTHER",
  "subject": "string",
  "description": "string",
  "priority": "LOW | MEDIUM | HIGH | URGENT"
}
```

#### Get All Complaints
- **GET** `/helpdesk/complaints`
- **Description**: Get paginated list of complaints with filtering and sorting
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Get Complaint by ID
- **GET** `/helpdesk/complaints/:id`
- **Description**: Get specific complaint details
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Update Complaint
- **PATCH** `/helpdesk/complaints/:id`
- **Description**: Update complaint information
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Assign Complaint
- **PATCH** `/helpdesk/complaints/:id/assign`
- **Description**: Assign complaint to an official
- **Access**: Admin, Barangay Captain, Secretary
- **Body**:
```json
{
  "assignedTo": "string"
}
```

#### Resolve Complaint
- **PATCH** `/helpdesk/complaints/:id/resolve`
- **Description**: Mark complaint as resolved
- **Access**: Admin, Barangay Captain, Secretary, Staff
- **Body**:
```json
{
  "resolution": "string"
}
```

#### Delete Complaint
- **DELETE** `/helpdesk/complaints/:id`
- **Description**: Delete complaint record
- **Access**: Admin, Barangay Captain

### 6.2 SUGGESTIONS

#### Create Suggestion
- **POST** `/helpdesk/suggestions`
- **Description**: Submit a new suggestion
- **Access**: All authenticated users
- **Body**:
```json
{
  "suggestorName": "string",
  "suggestorContact": "string?",
  "suggestorAddress": "string?",
  "category": "INFRASTRUCTURE | SERVICES | PROGRAMS | POLICIES | FACILITIES | TECHNOLOGY | OTHER",
  "title": "string",
  "description": "string"
}
```

#### Get All Suggestions
- **GET** `/helpdesk/suggestions`
- **Description**: Get paginated list of suggestions
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Update Suggestion
- **PATCH** `/helpdesk/suggestions/:id`
- **Description**: Update suggestion status and review
- **Access**: Admin, Barangay Captain, Secretary

### 6.3 BLOTTER CASES

#### Create Blotter Case
- **POST** `/helpdesk/blotter`
- **Description**: File a new blotter case
- **Access**: Admin, Barangay Captain, Secretary, Staff
- **Body**:
```json
{
  "complainantName": "string",
  "complainantAddress": "string",
  "complainantContact": "string?",
  "respondentName": "string",
  "respondentAddress": "string?",
  "respondentContact": "string?",
  "incidentType": "PHYSICAL_INJURY | VERBAL_ALTERCATION | PROPERTY_DAMAGE | THEFT | DOMESTIC_VIOLENCE | HARASSMENT | LAND_DISPUTE | NOISE_COMPLAINT | OTHER",
  "incidentDate": "string (ISO date)",
  "incidentLocation": "string",
  "narrative": "string",
  "receivingOfficer": "string",
  "investigatingOfficer": "string?"
}
```

#### Get All Blotter Cases
- **GET** `/helpdesk/blotter`
- **Description**: Get paginated list of blotter cases
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Update Blotter Case
- **PATCH** `/helpdesk/blotter/:id`
- **Description**: Update blotter case information
- **Access**: Admin, Barangay Captain, Secretary, Staff

### 6.4 APPOINTMENTS

#### Create Appointment
- **POST** `/helpdesk/appointments`
- **Description**: Schedule a new appointment
- **Access**: All authenticated users
- **Body**:
```json
{
  "applicantName": "string",
  "applicantContact": "string",
  "applicantEmail": "string?",
  "applicantAddress": "string?",
  "appointmentType": "CONSULTATION | DOCUMENT_REQUEST | COMPLAINT_FILING | BUSINESS_PERMIT | CERTIFICATION_REQUEST | MEETING | OTHER",
  "purpose": "string",
  "preferredDate": "string (ISO date)",
  "preferredTime": "string",
  "assignedOfficialId": "string?"
}
```

#### Get All Appointments
- **GET** `/helpdesk/appointments`
- **Description**: Get paginated list of appointments
- **Access**: Admin, Barangay Captain, Secretary, Staff

#### Update Appointment
- **PATCH** `/helpdesk/appointments/:id`
- **Description**: Update appointment information
- **Access**: Admin, Barangay Captain, Secretary, Staff

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "error": {
    "details": "Additional error information"
  }
}
```

## Success Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "statusCode": 200,
  "data": {
    // Response data
  }
}
```

## Pagination Response Format

Paginated endpoints return:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "statusCode": 200,
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Implementation Status

✅ **Completed**:
- Prisma schema with all models
- DTOs for all modules
- Repository interfaces
- Service implementations for Residents, Households, Documents, Complaints
- Repository implementations for core modules

🔄 **In Progress**:
- Remaining service implementations
- Controller implementations
- Module configurations
- Route definitions

📋 **Planned**:
- Authentication integration
- File upload for documents/photos
- Email notifications
- Report generation
- Data export functionality
