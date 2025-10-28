import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { compromissos } from '../data/compromissos.js';
import { tipos } from '../data/tipos.js';
import { verificarToken } from '../utils/autenticacao.js';

const router = express.Router();
router.use(verificarToken);

// Criar compromisso
router.post('/', (req, res) => {
  const usuarioId = req.usuarioId;
  const { tipoId, titulo, descricao, data, horaInicio, horaFim } = req.body;

  const tipo = tipos.find(t => t.id === tipoId && t.usuarioId === usuarioId);
  if (!tipo) return res.status(400).json({ erro: 'Tipo de compromisso inválido.' });

  // 🔹 Regra de negócio: evitar conflito de horário
  const conflito = compromissos.find(c =>
    c.usuarioId === usuarioId &&
    c.data === data &&
    !(
      horaFim <= c.horaInicio || horaInicio >= c.horaFim
    )
  );
  if (conflito)
    return res.status(400).json({ erro: 'Conflito de horário detectado.' });

  const novo = { id: uuidv4(), usuarioId, tipoId, titulo, descricao, data, horaInicio, horaFim };
  compromissos.push(novo);
  res.status(201).json(novo);
});

// Listar compromissos do usuário
router.get('/', (req, res) => {
  const usuarioId = req.usuarioId;
  const lista = compromissos
    .filter(c => c.usuarioId === usuarioId)
    .sort((a, b) => new Date(a.data + ' ' + a.horaInicio) - new Date(b.data + ' ' + b.horaInicio));
  res.json(lista);
});

// 🔹 Funcionalidade extra: Agenda da semana
router.get('/semana', (req, res) => {
  const usuarioId = req.usuarioId;
  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 7);

  const lista = compromissos.filter(c => {
    const d = new Date(c.data);
    return c.usuarioId === usuarioId && d >= inicioSemana && d <= fimSemana;
  });

  const ordenada = lista.sort((a, b) => new Date(a.data + ' ' + a.horaInicio) - new Date(b.data + ' ' + b.horaInicio));
  res.json(ordenada);
});

export default router;
