import { createServer } from "vite";

export const DEFAULT_VITE_PORT = 5173;

async function startViteServer() {
    const server = await createServer({ server: { port: DEFAULT_VITE_PORT } });

    await server.listen();
    console.log(`Vite server running on http://localhost:${DEFAULT_VITE_PORT}`);

    return server;
}

export default startViteServer;