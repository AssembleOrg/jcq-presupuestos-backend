import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Hash para las contraseñas
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Crear Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jcq.com' },
    update: {},
    create: {
      email: 'admin@jcq.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Admin creado:', admin.email);

  // Crear Subadmin
  const subadmin = await prisma.user.upsert({
    where: { email: 'subadmin@jcq.com' },
    update: {},
    create: {
      email: 'subadmin@jcq.com',
      password: hashedPassword,
      firstName: 'Subadmin',
      lastName: 'Sistema',
      role: UserRole.SUBADMIN,
      isActive: true,
    },
  });

  console.log('✅ Subadmin creado:', subadmin.email);

  // Crear Manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@jcq.com' },
    update: {},
    create: {
      email: 'manager@jcq.com',
      password: hashedPassword,
      firstName: 'Manager',
      lastName: 'Sistema',
      role: UserRole.MANAGER,
      isActive: true,
    },
  });

  console.log('✅ Manager creado:', manager.email);

  console.log('\n📋 Credenciales de acceso:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:');
  console.log('  Email: admin@jcq.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Subadmin:');
  console.log('  Email: subadmin@jcq.com');
  console.log('  Password: password123');
  console.log('');
  console.log('Manager:');
  console.log('  Email: manager@jcq.com');
  console.log('  Password: password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✨ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

