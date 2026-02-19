import { prisma } from './lib/prisma.js';

async function main() {
    const user = await prisma.user.create({
        data: {
            username: "admin",
            password: "hashedpassword",
            role: "admin"
        },
    });
    console.log("Created user:", user);
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
