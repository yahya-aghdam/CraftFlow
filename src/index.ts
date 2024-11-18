import express from 'express';
import authRoutes from './auth.routes';
import { API_PATH, HTTP_PORT, PROTO_PORT } from './config/dotenv';
import { validateEnv } from './util';
import { DEV_MODE, proto_url } from './config/constants';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { VerifyToken } from './protos/auth.service.proto';
import { AuthCheckService } from './protos/auth';

validateEnv();

// Expressjs
const app = express();
app.use(express.json());

app.use(API_PATH, authRoutes);

app.listen(HTTP_PORT, () => DEV_MODE && console.log(`Auth service running on port ${HTTP_PORT}`));


// Proto
const server = new Server();
server.addService(AuthCheckService, { VerifyToken })
server.bindAsync('localhost:50051', ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running on port ${PROTO_PORT} `);
});