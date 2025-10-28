import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { tipos } from '../data/tipos.js';
import { verificarToken } from '../utils/autenticacao.js';

const router = express.Router();
router.use(verificarToken);

// Criar tipo de compromisso
router.post('/', (req, res) => {
  const usuarioId = req.usuarioId;
  const { nome, descricao } = req.body;

  const tipo = { id: uuidv4(), usuarioId, nome, descricao };
  tipos.push(tipo);
  res.status(201).json(tipo);
});

// Listar tipos do usuário logado
router.get('/', (req, res) => {
  const usuarioId = req.usuarioId;
  res.json(tipos.filter(t => t.usuarioId === usuarioId));
});

export default router;
