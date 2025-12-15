import { useState } from 'react'
import supabase from '../../lib/supabase'

export default function Agendar() {
  const [nome, setNome] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([
        { nome, data, hora }
      ])

    if (error) {
      console.error('Erro ao agendar:', error.message)
    } else {
      console.log('Agendamento feito com sucesso:', booking)
    }
  }

  return (
    <div>
      <h1>Agendar</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Data:
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Hora:
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Agendar</button>
      </form>
    </div>
  )
}
