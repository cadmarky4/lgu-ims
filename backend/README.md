# LGU Information Management System - Backend

A comprehensive backend API for Local Government Unit Information Management System built with Node.js, TypeScript, Express, Prisma, and PostgreSQL following Clean Architecture principles with vertical slices.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles with **Vertical Slice Architecture** to ensure:
- High maintainability and testability
- Clear separation of concerns
- Independent and cohesive feature modules
- Easy scalability and feature development

### Architecture Layers

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│     (Controllers, Routes, DTOs)     │  
├─────────────────────────────────────┤
│           Application Layer         │
│        (Services, Use Cases)       │
├─────────────────────────────────────┤
│            Domain Layer             │
│    (Entities, Interfaces, Rules)   │
├─────────────────────────────────────┤
│         Infrastructure Layer        │
│   (Repositories, Database, APIs)   │
└─────────────────────────────────────┘
```

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Database migrations
├── src/
│   ├── app.ts                     # Express app configuration
│   ├── index.ts                   # Application entry point
│   ├── infrastructure/
│   │   └── database/
│   │       ├── connection.ts      # Database connection
│   │       └── seeds/             # Database seeders
│   ├── modules/                   # Feature modules (Vertical Slices)
│   │   ├── auth/                  # Authentication module
│   │   │   ├── application/
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   └── services/      # Business logic services
│   │   │   ├── domain/
│   │   │   │   └── interfaces/    # Domain interfaces
│   │   │   └── infrastructure/
│   │   │       ├── controllers/   # HTTP controllers
│   │   │       ├── repositories/  # Data access layer
│   │   │       └── routes/        # Route definitions
│   │   ├── residents/             # Resident management module
│   │   ├── households/            # Household management module
│   │   ├── user-management/       # User management module
│   │   ├── barangay-officials/    # Barangay officials module
│   │   ├── documents/             # Document processing module
│   │   └── helpdesk/              # Help desk module (blotters, complaints)
│   └── shared/                    # Shared utilities and middleware
│       ├── config/                # Configuration management
│       ├── middleware/            # Express middleware
│       └── utils/                 # Utility functions
├── tests/                         # Test files
├── logs/                          # Application logs
└── dist/                          # Compiled JavaScript output
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- PostgreSQL (>= 12.0)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration values.

4. **Database setup:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database
   npm run db:seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or your configured port).

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with initial data

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `JWT_EXPIRES_IN` | Access token expiration | `1d` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |
| `SWAGGER_ENABLED` | Enable API documentation | `true` |

## 🔐 Authentication & Authorization

The system implements JWT-based authentication with refresh tokens:

### User Roles Hierarchy
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Administrative access
- **BARANGAY_CAPTAIN**: Barangay leadership access
- **BARANGAY_SECRETARY**: Secretary functions
- **BARANGAY_TREASURER**: Financial functions
- **KAGAWAD**: Council member access
- **SK_CHAIRPERSON**: SK leadership
- **SK_KAGAWAD**: SK member access
- **STAFF**: Staff-level access
- **USER**: Basic user access

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/change-password` | Change password |
| GET | `/api/v1/auth/profile` | Get user profile |

## 📊 Database Schema

### Core Entities

#### Users
- User authentication and profile management
- Role-based access control
- Audit trail support

#### Refresh Tokens
- Secure token management
- Token rotation support
- Session management

### Future Module Entities (To be implemented)

#### Residents
- Personal information management
- Address and contact details
- Family relationships

#### Households
- Household composition
- Address management
- Socio-economic data

#### Barangay Officials
- Official positions and terms
- Contact information
- Responsibilities

#### Documents
- Document types and templates
- Processing workflows
- Digital signatures

#### Help Desk
- Incident reporting
- Blotter entries
- Complaint tracking
- Resolution workflows

## 🏭 Module Implementation Guide

Each module follows the same Clean Architecture structure:

### 1. Domain Layer (`domain/`)
- **Interfaces**: Define contracts and abstractions
- **Entities**: Business entities and value objects
- **Business Rules**: Domain-specific logic

### 2. Application Layer (`application/`)
- **DTOs**: Data transfer objects for API contracts
- **Services**: Business logic and use cases
- **Validation**: Input validation schemas

### 3. Infrastructure Layer (`infrastructure/`)
- **Controllers**: HTTP request handling
- **Repositories**: Data persistence implementation
- **Routes**: API endpoint definitions

### Creating a New Module

1. **Create directory structure:**
   ```bash
   mkdir -p src/modules/your-module/{application/{dto,services},domain/interfaces,infrastructure/{controllers,repositories,routes}}
   ```

2. **Define domain interfaces** in `domain/interfaces/`
3. **Create DTOs and validation** in `application/dto/`
4. **Implement business logic** in `application/services/`
5. **Build repositories** in `infrastructure/repositories/`
6. **Create controllers** in `infrastructure/controllers/`
7. **Define routes** in `infrastructure/routes/`
8. **Register routes** in `app.ts`

## 🔍 API Documentation

When `SWAGGER_ENABLED=true`, comprehensive API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api/docs`

## 🧪 Testing Strategy

### Test Structure
```
tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
├── e2e/                  # End-to-end tests
└── fixtures/             # Test data fixtures
```

### Testing Guidelines
- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test complete user workflows
- **Mocking**: Use appropriate mocking for external dependencies

## 📈 Monitoring & Logging

### Logging Levels
- **error**: Error conditions
- **warn**: Warning conditions
- **info**: Informational messages
- **debug**: Debug-level messages

### Log Destinations
- **Development**: Console output with colors
- **Production**: File-based logging with rotation

## 🛡️ Security Features

### Implemented
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Cross-origin request control
- **Helmet**: Security headers
- **Input Validation**: Zod schema validation

### Recommendations
- Use HTTPS in production
- Implement API versioning
- Set up proper firewall rules
- Regular security audits
- Keep dependencies updated

## 🚦 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Enforced linting rules
- **Prettier**: Consistent code formatting
- **Naming**: Clear, descriptive names

### Git Workflow
- **Feature Branches**: One feature per branch
- **Conventional Commits**: Standardized commit messages
- **Pull Requests**: Code review required
- **Testing**: All tests must pass

### Performance
- **Database Queries**: Optimize with indexes
- **Caching**: Implement where appropriate
- **Pagination**: For large data sets
- **Compression**: Gzip compression enabled

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Tests passing
- [ ] Security review completed
- [ ] Performance testing done

### Production Setup
- [ ] Load balancer configured
- [ ] Database backups enabled
- [ ] Monitoring tools setup
- [ ] Log aggregation configured
- [ ] SSL certificates installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Write tests for new features
5. Update documentation
6. Submit a pull request

## 📝 License

This project is proprietary software for Local Government Unit use.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**Note**: This is the foundation setup. Individual modules (residents, households, etc.) will be implemented following this architecture pattern. Each module will have its own detailed documentation and implementation guide.
