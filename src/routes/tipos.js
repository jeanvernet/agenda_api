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

// Deletar tipo de compromisso
router.delete('/:id', (req, res) => {
  const usuarioId = req.usuarioId;
  const { id } = req.params;

  // Encontra o índice do tipo pertencente ao usuário
  const index = tipos.findIndex(t => t.id === id && t.usuarioId === usuarioId);

  if (index === -1)
    return res.status(404).json({ erro: 'Tipo não encontrado.' });

  tipos.splice(index, 1);
  res.json({ mensagem: 'Tipo removido com sucesso.' });
});


export default router;
