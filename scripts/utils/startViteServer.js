import { createServer } from "vite";

export const DEFAULT_VITE_PORT = 5173;

async function startViteServer(port = DEFAULT_VITE_PORT) {
    const server = await createServer({ server: { port } });

    await server.listen();
    console.log(`Vite server running on http://localhost:${port}`);

    return server;
}

export default startViteServer;