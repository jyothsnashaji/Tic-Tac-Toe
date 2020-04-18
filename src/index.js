import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return(
    <button style={{background:props.color}} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {



    renderSquare(i) {
      return( <Square color={this.props.colors[i]} value={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>);
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
        colors:Array(9).fill('#fff'),
        winner:null
      };
      this.calculateWinner=this.calculateWinner.bind(this);
    }
   
    handleClick(i){
      const history=this.state.history.slice(0,this.state.stepNumber+1);
      const current=history[history.length-1];
      const squares=current.squares.slice();
      if(squares[i] || this.state.winner) return;           
      squares[i]= this.state.xIsNext? 'X': 'O';
      this.calculateWinner(squares);

      this.setState({
     history:history.concat([{
       squares:squares,
     }]),
     stepNumber:history.length,
    xIsNext:!this.state.xIsNext,});
    }
    jumpTo(step){
      this.setState({
        history:this.state.history.slice(0,step+1),
        stepNumber:step,
        xIsNext:step%2===0,
        colors:Array(9).fill('#fff'),
        winner:null
      })
    }
    calculateWinner(squares) {
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
      
      const colors=this.state.colors;

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          colors[a]='yellow';
          colors[b]='yellow';
          colors[c]='yellow';
          this.setState({colors:colors,winner:squares[a]});
          return;
        }
      }
  
      for(let i=0;i<squares.length;++i)
      {
        if(!squares[i])
          return;  
      }
      this.setState({winner:'draw'});
    }

    render() {
      const history=this.state.history;
      const current =history[this.state.stepNumber];

      const winner=this.state.winner;
      let moves,desc;
      moves=history.slice(2,).map((step,move)=>{
      desc='Go to move #' +(move+1);
        return (
          <li key={move}>
            <span className="move" onClick={()=> this.jumpTo(move+1)}>{desc}</span>
          </li>
        );
      });
      var b= winner? 'PLAY AGAIN':'RESTART';

      var status= winner? ((winner==='draw')? 'DRAW' : 'WINNER : '+winner) : 'Next player: '+(this.state.xIsNext? 'X':'O');

      return (
        <div className="game">
          <h2>{status}</h2><br></br>
          <div> <div className="game-board">
            <Board squares={current.squares} colors={this.state.colors}
            onClick={(i)=>this.handleClick(i)}/>
          </div>
          <div className="game-info">            
            <ol start="2">{moves}</ol>
          </div><br></br></div>
         
          <button onClick={()=>this.jumpTo(0)} className="restart">{b}</button>
        </div>
      );
    }
  }
  


  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  