import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export class PrismaConnection {
	private static instance: PrismaClient;

	private constructor() { }

	static getInstance(): PrismaClient {
		if (!PrismaConnection.instance) {
			const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
			PrismaConnection.instance = new PrismaClient({ adapter });
		}
		return PrismaConnection.instance;
	}
}