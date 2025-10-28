import { v4 as uuidv4 } from 'uuid';

export let usuariosLogados = [];

// Criar token
export function criarSessao(usuarioId) {
  const token = uuidv4();
  usuariosLogados.push({ usuarioId, token });
  return token;
}

// 🔹 Middleware: verifica se o token é válido
export function verificarToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

  const sessao = usuariosLogados.find(s => s.token === token);
  if (!sessao) return res.status(403).json({ erro: 'Token inválido.' });

  req.usuarioId = sessao.usuarioId;
  next();
}

// Logout
export function encerrarSessao(token) {
  usuariosLogados = usuariosLogados.filter(s => s.token !== token);
}
