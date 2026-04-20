import { PrismaClient } from '@prisma/client';

async function makeAdmin(email: string) {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.update({
      where: { mail: email },
      data: { role: 'admin' },
    });
    console.log(`✓ Usuario ${email} ahora es admin`, user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Uso: npx ts-node make-admin.ts tu-email@gmail.com');
  process.exit(1);
}

makeAdmin(email);
