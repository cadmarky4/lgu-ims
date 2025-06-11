import { Request, Response, NextFunction } from 'express';
import { ResidentService } from '../../application/services/resident.service';
import { CreateResidentDto, UpdateResidentDto, ResidentQueryDto } from '../../application/dto/resident.dto';
import { ApiResponseBuilder } from '@/shared/utils/api-response';
import { AuthenticatedRequest } from '@/shared/middleware/auth.middleware';

export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createResidentDto: CreateResidentDto = req.body;
      const resident = await this.residentService.create(createResidentDto);
      
      const response = ApiResponseBuilder.success(resident, 'Resident created successfully');
      res.status(201).json(response);
    } catch (error: any) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: ResidentQueryDto = req.query;
      const result = await this.residentService.findAll(query);
      
      const response = ApiResponseBuilder.successWithPagination(
        result.data,
        result.page,
        result.limit,
        result.total,
        'Residents retrieved successfully'
      );
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  };

  getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statistics = await this.residentService.getStatistics();
      
      const response = ApiResponseBuilder.success(statistics, 'Resident statistics retrieved successfully');
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  };

  getHouseholdHeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const householdHeads = await this.residentService.getHouseholdHeads();
      
      const response = ApiResponseBuilder.success(householdHeads, 'Household heads retrieved successfully');
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query.q as string;
      const residents = await this.residentService.search(query);
      
      const response = ApiResponseBuilder.success(residents, 'Search results retrieved successfully');
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const resident = await this.residentService.findOne(id);
      
      const response = ApiResponseBuilder.success(resident, 'Resident retrieved successfully');
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  };

  update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const updateResidentDto: UpdateResidentDto = req.body;
      const resident = await this.residentService.update(id, updateResidentDto);
      
      const response = ApiResponseBuilder.success(resident, 'Resident updated successfully');
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  };

  remove = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      await this.residentService.remove(id);
      
      const response = ApiResponseBuilder.success(null, 'Resident deleted successfully');
      res.status(200).json(response);
    } catch (error: any) {
      next(error);
    }
  };
}
