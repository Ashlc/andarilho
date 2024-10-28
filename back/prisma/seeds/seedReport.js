
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedReport() {
    const report = await prisma.report.upsert({
        where: { processNumber: "0123456789" },
        update: {},
        create: {
            status: "PENDING",
            resource: "RAMP",
            description: "Rampa inacessível",
            photos: [],
            userId: 1,
            locationId: 1,
            processNumber: "0123456789"
        },
    });
    return report;
}

module.exports = { seedReport };
