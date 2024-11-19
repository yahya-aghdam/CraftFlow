import express from 'express';
import authRoutes from './auth.routes';
import { API_PATH, HTTP_PORT, MAIN_URL} from './config/dotenv';
import { validateEnv } from './util';
import { DEV_MODE, proto_url } from './config/constants';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { verifyToken } from './protos/auth.service.proto';
import { AuthCheckService } from './protos/auth';
import linksmith from 'linksmith';

validateEnv();

// Expressjs
const app = express();
app.use(express.json());

app.use(API_PATH, authRoutes);

app.listen(HTTP_PORT, () => DEV_MODE && console.log(`Auth service running on ==> ${linksmith(MAIN_URL,{port:HTTP_PORT})}`));


// Proto
const server = new Server();
server.addService(AuthCheckService, { verifyToken })
server.bindAsync(proto_url, ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running on ==> grpc://${proto_url}`);
});