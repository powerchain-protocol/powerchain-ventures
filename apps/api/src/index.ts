import http from "node:http";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";
import { env } from "./env/index.js";
import { requestContext } from "./context/request-context.js";
import { v1Router } from "./api/v1/router.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { corsMiddleware } from "./middleware/cors.js";
import { generalRateLimit } from "./middleware/rate-limit.js";
import { rejectSecretMaterial, securityHeaders } from "./middleware/security.js";
import { attachWebSocketServer } from "./websocket/server.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", env.TRUST_CLOUDFLARE_PROXY ? env.TRUST_PROXY_HOPS : false);
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestContext);
app.use(generalRateLimit);

// Better Auth must receive the untouched request body.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "1mb" }));
app.use(rejectSecretMaterial);
app.use("/api/v1", v1Router);
app.get("/health", (_req, res) => res.redirect(307, "/api/v1/health"));
app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
attachWebSocketServer(server);
server.listen(env.PORT, () => console.log(`PowerChain Ventures API listening on :${env.PORT} (${env.POWERCHAIN_DATA_MODE})`));
