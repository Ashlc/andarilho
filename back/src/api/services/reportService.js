const { PrismaClient } = require("@prisma/client");
const PDFDocument = require("pdfkit");
const prisma = new PrismaClient();

class ReportService {
    async getAllReports() {
        return await prisma.report.findMany({
            include: {
                location: true,
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async getReportById(id) {
        return await prisma.report.findUnique({
            where: { id: Number(id) },
            include: {
                location: true,
                user: true,
            },
        });
    }

    // Modificar o método para aceitar múltiplos processNumbers
    async getReportprocessNumbers(processNumbers) {
        console.log("processNumbers recebidos: ", processNumbers);
        return await prisma.report.findMany({
            where: {
                processNumber: {
                    in: processNumbers, // Filtrar apenas os processNumbers fornecidos
                },
            },
            include: {
                location: true,
                user: true,
            },
        });
    }

    async createReport(data) {
        return await prisma.report.create({
            data,
        });
    }

    async updateReport(id, data) {
        return await prisma.report.update({
            where: { id: Number(id) },
            data,
        });
    }

    async deleteReport(id) {
        return await prisma.report.delete({
            where: { id: Number(id) },
        });
    }

    async filterReports(filters) {
        // Filtro de relatórios com base nos parâmetros fornecidos
        return await prisma.report.findMany({
            where: filters,
            include: {
                location: true,
                user: true,
            },
        });
    }

    // Método para gerar PDF com múltiplos processNumbers
    async generateReportPDF(processNumbers, res) {
        try {
            const reports = await this.getReportprocessNumbers(processNumbers);

            if (reports.length === 0) {
                return res
                    .status(404)
                    .json({ message: "Nenhum relatório encontrado" });
            }

            const doc = new PDFDocument();

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=reports.pdf"
            );

            doc.pipe(res);

            doc.fontSize(18).text("Relatórios Gerados", { align: "center" });
            doc.moveDown();

            reports.forEach((report) => {
                doc.fontSize(14).text(`ID: ${report.id}`);
                doc.text(`Status: ${report.status}`);
                doc.text(`Localização: ${report.location.address}`);
                doc.text(`Usuário: ${report.user.email}`);
                doc.text(`Tipo: ${report.resource}`);
                doc.text(`Descrição: ${report.description}`);
                doc.moveDown();
            });

            doc.end();
        } catch (error) {
            console.error("Erro ao gerar o PDF: ", error);
            return res.status(500).json({ message: "Erro ao gerar o PDF" });
        }
    }
}

module.exports = new ReportService();
