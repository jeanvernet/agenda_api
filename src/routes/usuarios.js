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

// Listar usuários 
router.get('/', (req, res) => {
  const lista = usuarios.map(({ senha, ...u }) => u);
  res.json(lista);
});


router.get('/:id', (req, res) => {
  const { id } = req.params;

  const user = usuarios.find(u => u.id === id);
  if (!user)
    return res.status(404).json({ erro: 'Usuário não encontrado.' });

  res.json(user);
});


// routes/usuarios.js
router.delete('/:id', (req, res) => {
  const usuarioId = req.usuarioId; // ID do usuário autenticado
  const { id } = req.params;

  // Garantir que o usuário só pode deletar a própria conta
  if (usuarioId !== id) return res.status(403).json({ erro: 'Acesso negado.' });

  const index = usuarios.findIndex(u => u.id === id);
  if (index === -1)
    return res.status(404).json({ erro: 'Usuário não encontrado.' });

  usuarios.splice(index, 1);
  res.json({ mensagem: 'Usuário removido com sucesso.' });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  const user = usuarios.find(u => u.id === id);
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado.' });

  if (nome) user.nome = nome;
  if (email) user.email = email;
  if (senha) user.senha = senha;

  res.json({ mensagem: 'Usuário atualizado com sucesso.', usuario: user });
});


export default router;
