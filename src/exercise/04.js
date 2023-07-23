// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

// const [squares, setSquares] = React.useState(() => {
//   const localStorageSquares = window.localStorage.getItem('squares')
//   if (localStorageSquares) {
//     return JSON.parse(localStorageSquares)
//   }
//   return Array(9).fill(null)
// })
function Board({squares, setSquares, setHistory}) {
  // const [squares, setSquares] = useLocalStorageState(
  //   'squares',
  //   Array(9).fill(null),
  // )

  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) return
    const nextSquares = [...squares]
    nextSquares[square] = nextValue
    setSquares(nextSquares)
    setHistory(o => [...o, nextSquares])
  }
  function restart() {
    setSquares(Array(9).fill(null))
    setHistory([[]])
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function History({history, setSquares, currentIndex}) {
  function jumpToMove(index) {
    setSquares(history[index])
  }

  return (
    <div>
      {history.map((board, index) => {
        let listText
        if (index === 0) {
          listText = 'Go to Game Start'
        } else {
          listText = `Go to move#${index + 1}`
        }

        return (
          <div
            onClick={() => jumpToMove(index)}
            key={index}
            style={{color: currentIndex === index ? 'gray' : 'black'}}
          >
            {listText} {currentIndex === index && '(Current)'}
          </div>
        )
      })}
    </div>
  )
}

function Game() {
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  const [history, setHistory] = useLocalStorageState('board_history', [[]])

  const currentIndex = history.indexOf(squares)
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          setSquares={setSquares}
          setHistory={setHistory}
        />
      </div>
      <History
        history={history}
        setSquares={setSquares}
        currentIndex={currentIndex}
      />
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
