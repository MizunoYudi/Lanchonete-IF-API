import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";
import { SlotNotasManager } from "./patterns/singleton/SlotNotasManager";
import { PrismaConnection } from "./config/database";
import { PromocaoService } from "./service/PromocaoService";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
    const swaggerDocument = await import("./generated/swagger.json");
    res.send(swaggerUi.generateHTML(swaggerDocument));
});

RegisterRoutes(app);

const PORT = 3001;

async function start() {
    await SlotNotasManager.getInstance().carregarDoDb();
    const promocaoService = new PromocaoService();
    await promocaoService.carregar();
    console.log("Promoções carregadas do banco de dados");
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Documentação Swagger em http://localhost:${PORT}/docs`);
    });
}

start();

process.on("SIGINT", async () => {
    await PrismaConnection.getInstance().$disconnect();
    process.exit(0);
});