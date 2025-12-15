'use client'

import { useEffect, useState } from 'react'
import supabase from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [estabelecimento, setEstabelecimento] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchDados()
  }, [])

  async function fetchDados() {
    // 1. Verificar usuário logado
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    // 2. Buscar o estabelecimento deste usuário
    const { data: est } = await supabase
      .from('estabelecimentos')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (est) {
      setEstabelecimento(est)

      // 3. Buscar agendamentos deste estabelecimento
      const { data: agends } = await supabase
        .from('bookings')
        .select('*')
        .eq('estabelecimento_id', est.id)
        .order('data', { ascending: true })

      setAgendamentos(agends || [])
    }
    setLoading(false)
  }

  if (loading) return <div style={styles.container}>Carregando...</div>

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Painel: {estabelecimento?.nome_negocio}</h1>
        <button 
          onClick={() => window.open(`/booking/${estabelecimento?.slug}`, '_blank')}
          style={styles.linkBtn}
        >
          Ver meu link público 🔗
        </button>
      </header>

      <div style={styles.card}>
        <h2 style={{color: '#000'}}>Próximos Agendamentos</h2>
        {agendamentos.length === 0 ? (
          <p style={{color: '#666', marginTop: '10px'}}>Nenhum agendamento encontrado.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Hora</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((item) => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>{item.nome_cliente}</td>
                  <td style={styles.td}>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                  <td style={styles.td}>{item.hora.slice(0, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '40px 5%', background: '#f8f9fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', color: '#111' },
  card: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  linkBtn: { padding: '10px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', color: '#444' },
  td: { padding: '12px', borderBottom: '1px solid #eee', color: '#000' },
  tr: { transition: 'background 0.2s' },
}