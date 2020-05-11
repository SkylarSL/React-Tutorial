import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
A component takes in parameters, called props (short for “properties”), 
and returns a hierarchy of views to display via the render method

The render method returns a description of what you want to see on the 
screen. React takes the description and displays the result. In 
particular, render returns a React element, which is a lightweight 
description of what to render
*/

/*
In React, function components are a simpler way to write components 
that only contain a render method and don’t have their own state. 
Instead of defining a class which extends React.Component, we can 
write a function that takes props as input and returns what should 
be rendered
*/
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  //function to render a square
  renderSquare(i) {
    return (
      
      /*
      can pass values using props (properties), you set the 
      properties to be passed by adding them in like below
      ex. the variable "value" is assigned the property 
      this.props.squares[i]

      properties allow communication between child and parent 
      components.

      a child can access its properties by typing 
      {this.props.propertyName}
      */
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    //return the html template to be rendered
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	
	constructor(props) {

    //this should be called in every constructor
    super(props);

    /*
    sets the state of the component, state is like memory, it can
    be altered and the component will "remember" its state
    */
    this.state = {

      /*
      these are the attributes of the state, these are the 
      variables that can be changed throughout the program
      */
      history: [{
        squares: Array(9).fill(null)
			}],
			stepNumber: 0,
      xIsNext: true,
    };
  }

	handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    /*
    if someone won the game or if the square the user clicked on 
    it not empty, return
    */
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    //alternate between X and O
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
			}]),
			stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
	}
	
	jumpTo(step){
		this.setState({
			stepNumber: step, 
			xIsNext: (step % 2) === 0,
		});
	}

	render() {

		const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {

      const desc = move ? 'Go to move #' + move : 'Go to game start';

      return (
        
        //key is used to keep track of a list of react elements
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

		let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={i => this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

//renders the main components
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
