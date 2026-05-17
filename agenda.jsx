// agenda.jsx — Agenda de Visitas e Instalações
// Ceará Planejados — Vidraçaria
//
// ETAPA 1: Página preparada para expansão futura.
// Funcionalidades planejadas:
//   - Calendário de visitas técnicas
//   - Agenda de instalações
//   - Lembretes e notificações
//   - Histórico de atendimentos

export default function Agenda() {
  // Dados simulados para a UI inicial
  const proximosEventos = [
    { data: 'Seg, 19 Mai', hora: '09:00', tipo: 'Medição', cliente: 'João Silva', local: 'Rua das Flores, 123', status: 'confirmado' },
    { data: 'Seg, 19 Mai', hora: '14:00', tipo: 'Instalação', cliente: 'Maria Costa', local: 'Av. Principal, 456', status: 'confirmado' },
    { data: 'Ter, 20 Mai', hora: '10:30', tipo: 'Medição', cliente: 'Pedro Alves', local: 'Rua Nova, 789', status: 'pendente' },
    { data: 'Qua, 21 Mai', hora: '08:00', tipo: 'Entrega', cliente: 'Ana Souza',  local: 'Bairro Centro',      status: 'confirmado' },
  ];

  return (
    <div id="pgAgenda" className="pg on">
      <div className="hero">
        <div className="hero-ttl">📅 Agenda</div>
        <div className="hero-sub">Visitas técnicas e instalações agendadas</div>
      </div>

      <div className="section">

        {/* Banner "em construção" — remover quando implementar */}
        <div className="card" style={{
          background: 'linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02))',
          borderColor: 'rgba(201,168,76,.2)',
          marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🚧</span>
          <div>
            <div style={{ fontSize: '.76rem', fontWeight: 700, color: 'var(--gold2)', marginBottom: '3px' }}>
              Em desenvolvimento
            </div>
            <div style={{ fontSize: '.65rem', color: 'var(--t4)', lineHeight: 1.5 }}>
              Calendário interativo e agendamento online em breve.
            </div>
          </div>
        </div>

        {/* Lista de próximos eventos */}
        <div className="section-ttl">Próximos Eventos</div>
        {proximosEventos.map((ev, i) => (
          <div key={i} className="card" style={{ padding: '14px 16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.2)',
                  borderRadius: '10px', padding: '8px 10px', textAlign: 'center', flexShrink: 0,
                }}>
                  <div style={{ fontSize: '.6rem', color: 'var(--t4)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {ev.data.split(',')[0]}
                  </div>
                  <div style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--gold2)' }}>
                    {ev.hora}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '3px' }}>
                    {ev.tipo} — {ev.cliente}
                  </div>
                  <div style={{ fontSize: '.65rem', color: 'var(--t4)' }}>{ev.local}</div>
                  <div style={{ fontSize: '.63rem', color: 'var(--t3)', marginTop: '3px' }}>{ev.data}</div>
                </div>
              </div>
              <span className={`badge ${ev.status === 'confirmado' ? 'badge-grn' : 'badge-gold'}`}>
                {ev.status === 'confirmado' ? '✓ OK' : '⏳'}
              </span>
            </div>
          </div>
        ))}

        {/* Botão de novo agendamento (placeholder) */}
        <button
          className="btn btn-gold btn-full"
          style={{ marginTop: '8px' }}
          onClick={() => alert('Agendamento: funcionalidade em desenvolvimento')}
        >
          + Novo Agendamento
        </button>
      </div>

      <div style={{ height: '80px' }} />
    </div>
  );
}
