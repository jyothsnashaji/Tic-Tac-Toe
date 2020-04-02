import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {



    renderSquare(i) {
      return( <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>);
    }
    createBoard(){
      let board=[]
      for(let i=0;i<3;++i)
      {
        let square=[];
        for(let j=0;j<3;++j)
          {
            square.push(this.renderSquare(i*3+j))
          }
        board.push(<div className="board-row">{square}</div>)
      }
      return board

    }
  
    render() {

  
      return (
        <div>
         { this.createBoard()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props)
    {
      super(props);
      this.state={
        history:[{
          squares:Array(9).fill(null),
        }],
        stepNumber:0,
        xIsNext:true,
      };
    }
    handleClick(i){
      const history=this.state.history.slice(0,this.state.stepNumber+1);
      const current=history[history.length-1];
      const squares=current.squares.slice();
      if(calculateWinner(squares)||squares[i]){
        return;
      }
      squares[i]= this.state.xIsNext? 'X': 'O';
      this.setState({
     history:history.concat([{
       squares:squares,
     }]),
     stepNumber:history.length,
    xIsNext:!this.state.xIsNext,});

    }
    jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext:step%2===0,
      })
    }

    render() {
      const history=this.state.history;
      const current =history[this.state.stepNumber];
      const winner=calculateWinner(current.squares);
      const moves=history.map((step,move)=>{
        const desc=move? 'Go to move #' +move :
        'RESTART';
        return (
          <li key={move}>
            <span className="move" onClick={()=> this.jumpTo(move)}>{desc}</span>
          </li>
        );
      });

      let status;
      if (winner)
      {
        if(winner==='draw')
        {
          status='DRAW'
        }
        else{
          status ='WINNER : '+winner;
        }
      }else{
        status = 'Next player: '+(this.state.xIsNext? 'X':'O');

      }
      return (
        <div className="game">
          <h2>{status}</h2>
          <div className="game-board">
            <Board squares={current.squares}
            onClick={(i)=>this.handleClick(i)}/>
          </div>
          <div className="game-info">
            
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
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

    for(let i=0;i<squares.length;++i)
    {
      if(!squares[i])
        return null;

    }
    return 'draw';
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  