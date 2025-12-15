'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../../lib/supabase'

export default function Cadastro() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nomeNegocio, setNomeNegocio] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Criar o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      // 2. Criar o estabelecimento vinculado a esse usuário
      const { error: dbError } = await supabase
        .from('estabelecimentos')
        .insert({
          nome_negocio: nomeNegocio,
          slug: slug.toLowerCase().replace(/\s+/g, '-'), // Garante slug limpo
          user_id: authData.user.id
        })

      if (dbError) {
        setError("Erro ao criar perfil do negócio. O link (slug) já pode estar em uso.")
      } else {
        alert("Conta criada com sucesso!")
        router.push('/dashboard') // Vamos criar essa página a seguir
      }
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Comece sua agenda online</h2>
        <form onSubmit={handleCadastro} style={styles.form}>
          <label style={styles.label}>Seu E-mail</label>
          <input 
            type="email" 
            style={styles.input} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <label style={styles.label}>Senha</label>
          <input 
            type="password" 
            style={styles.input} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <hr style={styles.hr} />

          <label style={styles.label}>Nome do Negócio</label>
          <input 
            type="text" 
            style={styles.input} 
            placeholder="Ex: Barbearia do João"
            value={nomeNegocio} 
            onChange={(e) => setNomeNegocio(e.target.value)} 
            required 
          />

          <label style={styles.label}>Link desejado (Slug)</label>
          <div style={styles.slugInputWrapper}>
            <span style={styles.prefix}>agendai.com/</span>
            <input 
              type="text" 
              style={styles.slugInput} 
              placeholder="barbearia-joao"
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              required 
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar minha agenda'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', padding: '20px' },
  card: { background: '#fff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { textAlign: 'center', marginBottom: '30px', fontSize: '22px', fontWeight: 'bold', color: '#111' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '14px', fontWeight: 600, color: '#374151' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', color: '#000' },
  hr: { border: '0', borderTop: '1px solid #e5e7eb', margin: '10px 0' },
  slugInputWrapper: { display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' },
  prefix: { background: '#f3f4f6', padding: '12px', color: '#6b7280', fontSize: '14px', borderRight: '1px solid #d1d5db' },
  slugInput: { padding: '12px', border: 'none', flex: 1, outline: 'none', fontSize: '16px', color: '#000' },
  button: { background: '#4f46e5', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  error: { color: '#dc2626', fontSize: '14px', textAlign: 'center' }
}