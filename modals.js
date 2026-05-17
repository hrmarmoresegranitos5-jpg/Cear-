// modals.js — Componentes de Modal / Overlay
// Ceará Planejados — Vidraçaria
//
// Componentes:
//   Modal         → overlay genérico (base para todos os modais)
//   ModalConfirm  → modal de confirmação com botões Cancelar / Confirmar
//   ModalWpp      → modal de envio de orçamento por WhatsApp (prévia do texto)
//   ModalNovoCliente → placeholder para cadastro de cliente
//
// Todos usam portal sobre o body via posição fixed.
// Fecham ao clicar no backdrop (fora do conteúdo).

import { useEffect } from 'react';

// ─────────────────────────────────────────────
// Modal — overlay base
// ─────────────────────────────────────────────
/**
 * @param {{
 *   aberto: boolean,
 *   onFechar: Function,
 *   titulo?: string,
 *   children: React.ReactNode,
 *   largura?: string
 * }} props
 */
export function Modal({ aberto, onFechar, titulo, children, largura = '320px' }) {
  // Bloqueia scroll do body enquanto modal está aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,.65)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        padding: '0 0 env(safe-area-inset-bottom)',
      }}
      onClick={onFechar}
    >
      <div
        style={{
          width: '100%', maxWidth: largura,
          background: 'var(--s2)',
          borderRadius: '20px 20px 0 0',
          border: '1px solid rgba(255,255,255,.06)',
          padding: '20px 20px 32px',
          boxShadow: '0 -8px 40px rgba(0,0,0,.5)',
          animation: 'slideUp .22s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {titulo && (
          <div style={{
            fontSize: '.82rem', fontWeight: 700, color: 'var(--tx)',
            marginBottom: '16px', paddingBottom: '12px',
            borderBottom: '1px solid rgba(255,255,255,.06)',
          }}>
            {titulo}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ModalConfirm — confirmação simples
// ─────────────────────────────────────────────
/**
 * @param {{
 *   aberto: boolean,
 *   titulo: string,
 *   mensagem: string,
 *   labelConfirmar?: string,
 *   labelCancelar?: string,
 *   onConfirmar: Function,
 *   onCancelar: Function,
 *   perigoso?: boolean
 * }} props
 */
export function ModalConfirm({
  aberto,
  titulo,
  mensagem,
  labelConfirmar = 'Confirmar',
  labelCancelar  = 'Cancelar',
  onConfirmar,
  onCancelar,
  perigoso = false,
}) {
  return (
    <Modal aberto={aberto} onFechar={onCancelar} titulo={titulo}>
      <div style={{ fontSize: '.78rem', color: 'var(--t3)', marginBottom: '20px', lineHeight: 1.6 }}>
        {mensagem}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-ghost btn-full"
          onClick={onCancelar}
        >
          {labelCancelar}
        </button>
        <button
          className={`btn btn-full ${perigoso ? 'btn-red' : 'btn-gold'}`}
          onClick={onConfirmar}
        >
          {labelConfirmar}
        </button>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// ModalWpp — prévia do orçamento para WhatsApp
// ─────────────────────────────────────────────
/**
 * @param {{
 *   aberto: boolean,
 *   onFechar: Function,
 *   texto: string,
 *   onEnviar: Function
 * }} props
 */
export function ModalWpp({ aberto, onFechar, texto, onEnviar }) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="📲 Enviar pelo WhatsApp">
      <div style={{
        background: 'rgba(0,0,0,.25)',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '.68rem',
        color: 'var(--t2)',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        maxHeight: '220px',
        overflowY: 'auto',
        marginBottom: '16px',
        fontFamily: 'monospace',
      }}>
        {texto}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn btn-ghost btn-full" onClick={onFechar}>
          Cancelar
        </button>
        <button className="btn btn-grn btn-full" onClick={onEnviar}>
          Abrir WhatsApp
        </button>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// ModalNovoCliente — placeholder cadastro
// ─────────────────────────────────────────────
/**
 * @param {{ aberto: boolean, onFechar: Function }} props
 */
export function ModalNovoCliente({ aberto, onFechar }) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="👤 Novo Cliente">
      <div style={{
        textAlign: 'center', padding: '16px 0',
        fontSize: '.76rem', color: 'var(--t4)',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚧</div>
        Cadastro de clientes em desenvolvimento.<br />
        Em breve disponível!
      </div>
      <button className="btn btn-ghost btn-full" onClick={onFechar}>
        Fechar
      </button>
    </Modal>
  );
}
