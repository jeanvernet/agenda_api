import express from 'express';
import cors from 'cors';

import usuariosRoutes from './routes/usuarios.js';
import tiposRoutes from './routes/tipos.js';
import compromissosRoutes from './routes/compromissos.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/tipos', tiposRoutes);
app.use('/api/compromissos', compromissosRoutes);
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ API FINANÇAS rodando na porta ${PORT}`));
