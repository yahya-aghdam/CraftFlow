import express from 'express';
import authRoutes from './auth.routes';
import { API_PATH, HTTP_PORT, MAIN_URL} from './config/dotenv';
import { validateEnv } from './util';
import { DEV_MODE, proto_url } from './config/constants';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { verifyToken } from './protos/auth.service.proto';
import { AuthCheckService } from './protos/auth';
import linksmith from 'linksmith';

// Make sure that all necessary vars are in .env file
validateEnv();

// Import Express.js and initialize the app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use the `authRoutes` router for the authentication API, mounted at the specified `API_PATH`
app.use(API_PATH, authRoutes);

// Start the Express server on the specified HTTP_PORT
app.listen(HTTP_PORT, () =>
    DEV_MODE &&
    console.log(`Auth service running on ==> ${linksmith(MAIN_URL, { port: HTTP_PORT })}`)
);
// Log the server's URL in development mode using the `linksmith` utility

// gRPC Server Initialization
const server = new Server();
// Create a new gRPC server instance

server.addService(AuthCheckService, { verifyToken });
// Register the `AuthCheckService` with the gRPC server and bind the `verifyToken` method to handle its calls

server.bindAsync(
    proto_url, // The address and port for the gRPC server to listen on
    ServerCredentials.createInsecure(), // Use insecure credentials (no SSL/TLS) for simplicity in development
    () => {
        // Callback function executed once the gRPC server is bound successfully
        console.log(`gRPC server running on ==> grpc://${proto_url}`);
    }
);
