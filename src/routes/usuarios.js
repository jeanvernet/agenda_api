import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { usuarios } from '../data/usuarios.js';

const router = express.Router();

// Criar usuário
router.post('/', (req, res) => {
  const { nome, telefone, email, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });

  const existe = usuarios.find(u => u.email === email);
  if (existe) return res.status(400).json({ erro: 'E-mail já cadastrado.' });

  const novo = { id: uuidv4(), nome, telefone, email, senha };
  usuarios.push(novo);
  res.status(201).json(novo);
});

// Listar usuários (apenas para teste)
router.get('/', (req, res) => res.json(usuarios));

export default router;
