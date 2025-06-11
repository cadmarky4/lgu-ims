import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { ApiResponseBuilder } from '@/shared/utils/api-response';
import { 
  LoginDto, 
  RegisterDto, 
  RefreshTokenDto, 
  ChangePasswordDto 
} from '../../application/dto/auth.dto';
import { AuthenticatedRequest } from '@/shared/middleware/auth.middleware';

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginDto: LoginDto = req.body;
      const result = await this.authService.login(loginDto);
      
      const response = ApiResponseBuilder.success(result, 'Login successful');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registerDto: RegisterDto = req.body;
      const result = await this.authService.register(registerDto);
      
      const response = ApiResponseBuilder.success(result, 'Registration successful');
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenDto: RefreshTokenDto = req.body;
      const tokens = await this.authService.refreshToken(refreshTokenDto);
      
      const response = ApiResponseBuilder.success(tokens, 'Token refreshed successfully');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const changePasswordDto: ChangePasswordDto = req.body;
      const userId = req.user!.id;
      
      await this.authService.changePassword(userId, changePasswordDto);
      
      const response = ApiResponseBuilder.success(null, 'Password changed successfully');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);
      
      const response = ApiResponseBuilder.success(null, 'Logout successful');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  profile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = ApiResponseBuilder.success(req.user, 'Profile retrieved successfully');
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
