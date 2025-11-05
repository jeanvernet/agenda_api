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

router.put('/:id', (req, res) => {
  const usuarioId = req.usuarioId;
  const { id } = req.params;
  const { tipoId, titulo, descricao, data, horaInicio, horaFim } = req.body;

  const compromisso = compromissos.find(c => c.id === id && c.usuarioId === usuarioId);
  if (!compromisso)
    return res.status(404).json({ erro: 'Compromisso não encontrado.' });

  if (!tipoId || !titulo || !data || !horaInicio || !horaFim)
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });

  compromisso.tipoId = tipoId;
  compromisso.titulo = titulo;
  compromisso.descricao = descricao;
  compromisso.data = data;
  compromisso.horaInicio = horaInicio;
  compromisso.horaFim = horaFim;

  res.json({ mensagem: 'Compromisso atualizado com sucesso.', compromisso });
});

// routes/compromissos.js
router.delete('/:id', (req, res) => {
  const usuarioId = req.usuarioId;
  const { id } = req.params;

  const index = compromissos.findIndex(c => c.id === id && c.usuarioId === usuarioId);
  if (index === -1)
    return res.status(404).json({ erro: 'Compromisso não encontrado.' });

  compromissos.splice(index, 1);
  res.json({ mensagem: 'Compromisso removido com sucesso.' });
});



export default router;
