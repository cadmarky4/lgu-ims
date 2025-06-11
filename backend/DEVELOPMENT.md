# Development Guide - LGU Information Management System

## 🎯 Quick Start

### Option 1: Local Development

1. **Prerequisites**
   ```bash
   # Check Node.js version (should be >= 18.0.0)
   node --version
   
   # Check PostgreSQL installation
   psql --version
   ```

2. **Setup**
   ```bash
   # Run setup script (PowerShell on Windows)
   .\setup.ps1
   
   # Or manually:
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

### Option 2: Docker Development

1. **Start development services**
   ```bash
   # Start PostgreSQL and Redis for development
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Run app locally**
   ```bash
   # Update .env with Docker database URL
   DATABASE_URL="postgresql://lgu_dev:lgu_dev_password@localhost:5433/lgu_management_db_dev?schema=public"
   
   npm run dev
   ```

## 🏗️ Architecture Deep Dive

### Clean Architecture Implementation

Our implementation follows Uncle Bob's Clean Architecture with some adaptations for Node.js/TypeScript:

```
┌─────────────────────────────────────┐
│     🌐 Presentation Layer           │
│   Controllers, Routes, Middleware   │  
├─────────────────────────────────────┤
│     📋 Application Layer            │
│    Services, DTOs, Use Cases        │
├─────────────────────────────────────┤
│     🏛️ Domain Layer                 │
│  Entities, Interfaces, Business     │
│           Rules                     │
├─────────────────────────────────────┤
│     🔧 Infrastructure Layer         │
│ Repositories, Database, External    │
│           Services                  │
└─────────────────────────────────────┘
```

### Vertical Slice Benefits

- **Feature Cohesion**: All related code lives together
- **Independent Development**: Teams can work on different features simultaneously
- **Easier Testing**: Each slice can be tested in isolation
- **Reduced Coupling**: Features don't depend on each other's implementation details

## 📝 Module Development Workflow

### 1. Planning Phase

Before implementing a new module:

1. **Define the domain**
   - What entities are involved?
   - What business rules apply?
   - What are the use cases?

2. **Design the API**
   - What endpoints are needed?
   - What are the request/response structures?
   - What validation rules apply?

3. **Plan the database schema**
   - What tables are needed?
   - What relationships exist?
   - What indexes are required?

### 2. Implementation Phase

#### Step 1: Domain Layer
```typescript
// src/modules/your-module/domain/interfaces/your-module.interface.ts
export interface YourEntity {
  id: string;
  name: string;
  // ... other properties
}

export interface YourRepository {
  findById(id: string): Promise<YourEntity | null>;
  create(data: CreateYourEntityDto): Promise<YourEntity>;
  // ... other methods
}
```

#### Step 2: Application Layer
```typescript
// src/modules/your-module/application/dto/your-module.dto.ts
import { z } from 'zod';

export const createYourEntitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // ... other fields
});

export type CreateYourEntityDto = z.infer<typeof createYourEntitySchema>;
```

```typescript
// src/modules/your-module/application/services/your-module.service.ts
export class YourModuleService {
  constructor(private repository: YourRepository) {}

  async create(dto: CreateYourEntityDto): Promise<YourEntity> {
    // Business logic here
    return this.repository.create(dto);
  }
}
```

#### Step 3: Infrastructure Layer
```typescript
// src/modules/your-module/infrastructure/repositories/your-module.repository.ts
export class PrismaYourRepository implements YourRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<YourEntity | null> {
    return this.prisma.yourEntity.findUnique({ where: { id } });
  }
}
```

```typescript
// src/modules/your-module/infrastructure/controllers/your-module.controller.ts
export class YourModuleController {
  constructor(private service: YourModuleService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateYourEntityDto = req.body;
      const result = await this.service.create(dto);
      
      const response = ApiResponseBuilder.success(result, 'Created successfully');
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}
```

#### Step 4: Routes and Registration
```typescript
// src/modules/your-module/infrastructure/routes/your-module.routes.ts
const router = Router();

// Initialize dependencies
const prisma = getDatabase();
const repository = new PrismaYourRepository(prisma);
const service = new YourModuleService(repository);
const controller = new YourModuleController(service);

router.post('/', validateRequest({ body: createYourEntitySchema }), controller.create);

export { router as yourModuleRouter };
```

### 3. Testing Strategy

#### Unit Tests
```typescript
// src/modules/your-module/__tests__/your-module.service.test.ts
describe('YourModuleService', () => {
  let service: YourModuleService;
  let mockRepository: jest.Mocked<YourRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    service = new YourModuleService(mockRepository);
  });

  it('should create entity successfully', async () => {
    const dto = { name: 'Test Entity' };
    const expected = { id: '1', ...dto };
    
    mockRepository.create.mockResolvedValue(expected);
    
    const result = await service.create(dto);
    
    expect(result).toEqual(expected);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
  });
});
```

#### Integration Tests
```typescript
// src/modules/your-module/__tests__/your-module.integration.test.ts
describe('YourModule Integration', () => {
  let app: Express;
  
  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
    app = createTestApp();
  });

  it('should create entity via API', async () => {
    const dto = { name: 'Test Entity' };
    
    const response = await request(app)
      .post('/api/v1/your-module')
      .send(dto)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(dto.name);
  });
});
```

## 🔧 Useful Development Commands

### Database Operations
```bash
# Reset database (dangerous!)
npm run db:reset

# View database in browser
npm run db:studio

# Create new migration
npx prisma migrate dev --name your-migration-name

# Deploy migrations to production
npx prisma migrate deploy
```

### Code Quality
```bash
# Run all checks
npm run lint && npm run format:check && npm test

# Fix formatting and linting
npm run format && npm run lint:fix

# Run tests with coverage
npm run test:coverage
```

### Debugging
```bash
# Start in debug mode
npm run dev:debug

# Attach debugger (VS Code)
# Use launch configuration: "Attach to Node"
```

## 🚀 Deployment Guide

### Environment Setup

1. **Production Environment Variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-very-secure-secret-key
   JWT_REFRESH_SECRET=your-very-secure-refresh-key
   LOG_LEVEL=warn
   ```

2. **Build and Deploy**
   ```bash
   # Build for production
   npm run build
   
   # Run database migrations
   npm run db:migrate
   
   # Start production server
   npm start
   ```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Scale the application
docker-compose up -d --scale api=3
```

## 🔍 Monitoring and Debugging

### Logging
- **Development**: Colorized console output
- **Production**: Structured JSON logs to file
- **Log Levels**: error, warn, info, debug

### Health Checks
- **Endpoint**: `GET /health`
- **Database**: Connection status
- **Memory**: Usage statistics
- **Uptime**: Server runtime

### Performance Monitoring
```typescript
// Add to your service methods
const startTime = Date.now();
// ... your logic
logger.info('Operation completed', { 
  duration: Date.now() - startTime,
  operation: 'createEntity' 
});
```

## 🤝 Contributing Guidelines

### Code Standards
- Use TypeScript strict mode
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Pull Request Process
1. Create feature branch from `develop`
2. Implement feature following architecture
3. Write tests (unit + integration)
4. Update documentation
5. Submit PR with clear description
6. Address review feedback
7. Merge after approval

### Commit Message Format
```
type(scope): subject

body

footer
```

Example:
```
feat(auth): add password reset functionality

- Add password reset email endpoint
- Implement reset token validation
- Add rate limiting for reset requests

Closes #123
```

## 📚 Additional Resources

- [Clean Architecture by Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Vertical Slice Architecture](https://jimmybogard.com/vertical-slice-architecture/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Validation](https://zod.dev/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

Happy coding! 🚀 Remember: **Clean code, clean architecture, clean mind!**
