import express from 'express';
import { usuarios } from '../data/usuarios.js';
import { criarSessao, encerrarSessao } from '../utils/autenticacao.js';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user)
    return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });

  const token = criarSessao(user.id);
  res.json({ mensagem: 'Login realizado', token, usuarioId: user.id, nome: user.nome });
});

// Logout
router.post('/logout', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(400).json({ erro: 'Token não informado.' });

  encerrarSessao(token);
  res.json({ mensagem: 'Logout realizado com sucesso' });
});

export default router;
