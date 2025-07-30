import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("🟢 Inicializando WebSocket...");

        const io = new Server(res.socket.server, {
            cors: {
                origin: "http://localhost:3000", // actualiza si estás en producción
                methods: ["GET", "POST"]
            }
        });

        // 🔁 Solo una vez: manejar conexión
        io.on("connection", (socket) => {
            const email = socket.handshake.query.email;
            if (email) {
                socket.join(email); // 🔒 Room por usuario
                console.log(`👤 Usuario conectado: ${email}`);
            }

            socket.on("disconnect", () => {
                console.log(`🚪 Usuario desconectado: ${email}`);
            });
        });

        res.socket.server.io = io;
    }

    if (req.method === "POST") {
        const io = res.socket.server.io;
        const { email, message, type, id ,title,url} = req.body;

        console.log(`📨 Notificación para ${email}: ${message}`);
        io.to(email).emit("notification", { message, type, id ,title,url});

        return res.status(200).json({ success: true });
    }

    res.end();
}