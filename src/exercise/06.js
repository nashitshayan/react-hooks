// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {error: null}
//   }
//   static getDerivedStateFromError(error) {
//     return {error}
//   }
//   resetErrorBoundary() {
//     this.setState({error: null})
//     this.props.onReset('')
//   }

//   render() {
//     if (this.state.error) {
//       return (
//         <this.props.FallbackUI
//           error={this.state.error}
//           resetErrorBoundary={this.resetErrorBoundary.bind(this)}
//         />
//       )
//     }
//     return this.props.children
//   }
// }
function FallbackUI({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}
function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: 'resolved', pokemon: pokemonData})
      })
      .catch(error => {
        setState({status: 'rejected', error: error})
      })
  }, [pokemonName])

  let ui
  switch (state.status) {
    case 'idle':
      ui = 'Submit a pokemon'
      break
    case 'pending':
      ui = <PokemonInfoFallback name={pokemonName} />
      break
    case 'resolved':
      ui = <PokemonDataView pokemon={state.pokemon} />
      break
    case 'rejected':
      throw state.error
    default:
      ui = 'Submit a pokemon'
      break
  }
  return ui
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={FallbackUI}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
