import { PrismaClient, User, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '@/shared/utils/logger';
import { getDatabase } from '../connection';

const seedUsers = async (prisma: PrismaClient): Promise<void> => {
  logger.info('Seeding users...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@lgu.gov.ph' },
    update: {},
    create: {
      email: 'superadmin@lgu.gov.ph',
      username: 'superadmin',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lgu.gov.ph' },
    update: {},
    create: {
      email: 'admin@lgu.gov.ph',
      username: 'admin',
      password: hashedPassword,
      firstName: 'LGU',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  logger.info(`Created users: ${superAdmin.email}, ${admin.email}`);
};

const main = async (): Promise<void> => {
  const prisma = getDatabase();

  try {
    await seedUsers(prisma);
    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

main()
  .catch((error) => {
    logger.error('Seeding failed:', error);
    process.exit(1);
  });
