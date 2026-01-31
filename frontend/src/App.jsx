import { useState } from 'react'
import './App.css'

function App() {
  const [busqueda, setBusqueda] = useState("")
  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(false)

  const buscarJuegos = async () => {
    if (!busqueda) return; 
    setCargando(true);
    try {
      const respuesta = await fetch(`http://localhost:3001/search?q=${busqueda}`)
      if (!respuesta.ok) throw new Error("Error en el backend");
      const datos = await respuesta.json()
      setJuegos(datos)
    } catch (error) {
      console.error("Error:", error)
      alert("Error al conectar.")
    } finally {
      setCargando(false);
    }
  }

  const ordenarPorPrecio = () => {
    const juegosOrdenados = [...juegos].sort((a, b) => {
      const precioA = a.price ? a.price.final : 0;
      const precioB = b.price ? b.price.final : 0;
      return precioA - precioB;
    });
    setJuegos(juegosOrdenados);
  }

  // Helper para calcular porcentaje de descuento
  const getDescuento = (inicial, final) => {
    if (!inicial || !final || inicial === final) return null;
    return Math.round((1 - final / inicial) * 100);
  }

  return (
    <div className="container">
      <h1>🎮 Comparador de Steam</h1>
      
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Ej: Resident Evil, FIFA..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscarJuegos()}
        />
        <button onClick={buscarJuegos} disabled={cargando}>
          {cargando ? "Buscando..." : "Buscar"}
        </button>
        {juegos.length > 0 && (
          <button onClick={ordenarPorPrecio} className="btn-sort">
            Ordenar 💲
          </button>
        )}
      </div>

      <div className="results-grid">
        {juegos.map((juego) => {
          const discount = juego.price ? getDescuento(juego.price.initial, juego.price.final) : null;
          
          return (
            <a 
              key={juego.id} 
              href={`https://store.steampowered.com/app/${juego.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="card-link"
            >
              <div className="card">
                {/* Badge de descuento flotante */}
                {discount && <span className="discount-badge">-{discount}%</span>}
                
                <img src={juego.tiny_image} alt={juego.name} />
                <h3>{juego.name}</h3>
                
                <div className="price-container">
                  {juego.price ? (
                    <>
                      {/* Si hay descuento, mostramos el precio viejo tachado */}
                      {discount && (
                        <span className="old-price">
                          ${(juego.price.initial / 100).toFixed(2)}
                        </span>
                      )}
                      <span className="price">
                        ${(juego.price.final / 100).toFixed(2)} USD
                      </span>
                    </>
                  ) : (
                    <span className="free">Gratis / Sin precio</span>
                  )}
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default App