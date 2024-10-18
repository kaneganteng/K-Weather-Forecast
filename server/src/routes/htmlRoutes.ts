import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// logging __dirname so that typescript allows me to run this
console.log(__dirname);
// TODO: Define route to serve index.html

export default router;
