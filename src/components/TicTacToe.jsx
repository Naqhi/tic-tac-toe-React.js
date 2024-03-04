import { useState, useEffect } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import gameOverSoundAsset from "../sounds/game_over.wav";
import clickSoundAsset from "../sounds/click.wav";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations =[
    //rows

    {combo: [0,1,2], strikeClass: "strike-row-1"},
    {combo: [3,4,5], strikeClass: "strike-row-2"},
    {combo: [6,7,8], strikeClass: "strike-row-3"},
    
    //colums
    {combo: [0,3,6], strikeClass: "strike-column-1"},
    {combo: [1,4,7], strikeClass: "strike-column-2"},
    {combo: [2,5,8], strikeClass: "strike-column-3"},

    //diagonals
    {combo: [0,4,8], strikeClass: "strike-diagonal-1"},
    {combo: [2,4,6], strikeClass: "strike-diagonal-2"},
    
];

function checkWinner(tiles, setstrikeClass, setGameState) {
    for(const {combo, strikeClass} of winningCombinations){
        const tilevalue1 = tiles[combo[0]];
        const tilevalue2 = tiles[combo[1]];
        const tilevalue3 = tiles[combo[2]];

        if(
            tilevalue1 !== null && 
            tilevalue1 === tilevalue2 
            && tilevalue1 === tilevalue3 
        ){
            setstrikeClass(strikeClass);
            if (tilevalue1 === PLAYER_X) {
                setGameState(GameState.playerXWins);
            } else{
                setGameState(GameState.playerOWins);
            }
            return;
        }
    }

    const areAllTilesFilledIn = tiles.every((tile)=> tile !== null);
    if (areAllTilesFilledIn) {
        setGameState(GameState.draw);
    }
     
}

function TicTacToe() {
    const [tiles, SetTiles] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerturn] = useState(PLAYER_X);
    const [strikeClass, setstrikeClass] = useState();
    const [gameState, setGameState] = useState(GameState.inProgress);

    const handleTileClick = (index) => {
        if (gameState !== GameState.inProgress) {
            return;
        }

        if (tiles[index] !==null){
            return;
        }

         const newTiles = [...tiles];
         newTiles[index] = playerTurn;
         SetTiles(newTiles);
         if (playerTurn === PLAYER_X){
            setPlayerturn(PLAYER_O);
         } else {
            setPlayerturn(PLAYER_X);
         }
    };

    const handleReset = ()=> {
        setGameState(GameState.inProgress);
        SetTiles(Array(9).fill(null));
        setPlayerturn(PLAYER_X);
        setstrikeClass(null);
    }

    useEffect(() => {
        checkWinner(tiles, setstrikeClass, setGameState);
    }, [tiles]);

    useEffect(() =>{
        if (tiles.some((tile)=>tile !== null)) {
            clickSound.play();
        }
    }, [tiles]);

    useEffect(() =>{
        if (gameState !== GameState.inProgress) {
            gameOverSound.play();
        }
    }, [gameState]);

    return (
        <div>
            <h1>Tic Tac Toe</h1>
            <Board playerTurn={playerTurn} tiles={tiles} 
            onTileClick={handleTileClick} strikeClass={strikeClass}/>
            <GameOver gameState={gameState}/>
            <Reset gameState={gameState} onReset={handleReset}/>
        </div>
    );
}

export default TicTacToe;