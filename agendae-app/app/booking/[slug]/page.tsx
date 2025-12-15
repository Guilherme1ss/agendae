'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation' // 1. Hook para pegar o slug da URL
import supabase from '../../../lib/supabase'

export default function Agendar() {
  const { slug } = useParams() // Captura o "barbearia-do-ze" da URL
  
  const [estabelecimento, setEstabelecimento] = useState<any>(null)
  const [nome, setNome] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // 2. Buscar dados do estabelecimento ao carregar a página
  useEffect(() => {
    async function loadEstabelecimento() {
      const { data, error } = await supabase
        .from('estabelecimentos')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) setEstabelecimento(data)
    }
    loadEstabelecimento()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!estabelecimento) return
    
    setMessage(null)
    setLoading(true)

    // 3. Verificar conflito APENAS para este estabelecimento
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('estabelecimento_id', estabelecimento.id) // Filtro crucial
      .eq('data', data)
      .eq('hora', hora)
      .limit(1)

    if (existing && existing.length > 0) {
      setMessage('❌ Este horário já está ocupado neste estabelecimento.')
      setLoading(false)
      return
    }

    // 4. Inserir agendamento com o ID do estabelecimento
    const { error } = await supabase.from('bookings').insert({
      estabelecimento_id: estabelecimento.id, // Vínculo SaaS
      nome,
      data,
      hora,
    })

    if (error) {
      setMessage('❌ Erro ao realizar agendamento.')
    } else {
      setMessage(`✅ Agendamento em ${estabelecimento.nome_negocio} confirmado!`)
      setNome('')
      setData('')
      setHora('')
    }

    setLoading(false)
  }

  if (!estabelecimento && !loading) return <p>Carregando perfil...</p>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Título dinâmico com o nome do negócio */}
        <h1 style={styles.title}>{estabelecimento?.nome_negocio || 'Agendar'}</h1>
        <p style={{textAlign: 'center', fontSize: '14px', marginBottom: '10px'}}>
           Horário de funcionamento: <br/>{estabelecimento?.horario_abertura} às {estabelecimento?.horario_fechamento}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading || !estabelecimento ? 0.6 : 1,
            }}
            disabled={loading || !estabelecimento}
          >
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>

      {/* POPUP */}
      {message && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p>{message}</p>
            <button style={styles.modalButton} onClick={() => setMessage(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ===== ESTILOS ===== */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    padding: 32,
    borderRadius: 12,
    width: 320,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    background: '#4f46e5',
    color: '#fff',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    padding: 24,
    borderRadius: 10,
    width: 280,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 16,
    padding: 10,
    width: '100%',
    border: 'none',
    borderRadius: 6,
    background: '#4f46e5',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
