import { useState } from 'react'
import './App.css'

function App() {
  const [busqueda, setBusqueda] = useState("")
  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(false)

  const buscarJuegos = async () => {
    if (!busqueda) return; 
    setCargando(true);
    setJuegos([]);
    try {
      const respuesta = await fetch(`https://gamehunter-backend.onrender.com/search?q=${busqueda}`)
      const datos = await respuesta.json()
      setJuegos(datos)
    } catch (error) {
      console.error(error)
      alert("Error al conectar.")
    } finally {
      setCargando(false);
    }
  }

  // Generador de Links Inteligentes
  const getXboxLink = (name) => `https://www.xbox.com/es-ar/search?q=${encodeURIComponent(name)}`;
  const getPsLink = (name) => `https://store.playstation.com/es-ar/search/${encodeURIComponent(name)}`;

  return (
    <div className="app-container">
      <header>
        <h1 className="main-title">GAME<span className="highlight">HUNTER</span></h1>
        <p className="subtitle">Buscá en Steam, compará en Consolas</p>
      </header>
      
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Ej: Cyberpunk, FIFA, Resident Evil..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscarJuegos()}
        />
        <button onClick={buscarJuegos} disabled={cargando}>
          {cargando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <div className="results-grid">
        {juegos.map((juego) => (
          <div key={juego.id} className="card">
            
            {/* Click en la imagen lleva a Steam */}
            <a href={juego.link} target="_blank" rel="noopener noreferrer" className="img-link">
               <span className="store-badge">STEAM</span>
               <img 
                  src={juego.image} 
                  alt={juego.name} 
                  onError={(e) => {e.target.src="https://via.placeholder.com/300x150?text=No+Image"}}
               />
            </a>
            
            <div className="card-body">
              <h3>{juego.name}</h3>
              
              <div className="steam-price">
                  {juego.price > 0 ? (
                    <>
                      <span className="currency">US$</span>
                      <span className="amount">{juego.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="free">Gratis / Free</span>
                  )}
              </div>

              <div className="separator"></div>
              
              {/* BOTONES DE CONSOLAS */}
              <div className="console-links">
                <p>Ver precio en:</p>
                <div className="buttons-row">
                  <a href={getXboxLink(juego.name)} target="_blank" rel="noopener noreferrer" className="btn-console btn-xbox">
                    Xbox 🇦🇷
                  </a>
                  <a href={getPsLink(juego.name)} target="_blank" rel="noopener noreferrer" className="btn-console btn-ps">
                    PS Store 🇦🇷
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App