const swup = new Swup();

//Clean


swup.on('contentReplaced', mount);

function mount() {
//Player vs Player
   if(document.querySelector('.score-container')) {
    //Alerts
        const playerOne = (async () => {
            const { value: playerXName } = await Swal.fire({
                title: 'Player 1 name',
                input: 'text',
                inputPlaceholder: 'Player X name',
                showCancelButton: false,
                background: '#333336',
                confirmButtonText: 'CONTINUE',
                confirmButtonColor: '#333336',
                customClass: {
                    title: 'alert-content',
                    input: 'alert-input',
                    confirmButton: 'alert-confirm',
                },
                inputValidator: (value) => {
                  if (!value) {
                    return 'You need to write something!'
                  } else {
                    document.querySelector('.player-one').innerText = value ;
                    playerTwo();
                    document.querySelector('.current-player').innerText = value + "'s turn"
                  }
                }
              });
        })();

        const playerTwo = async () => {
            const {value: playerOName} = await Swal.fire({
                title: 'Player 2 name',
                input: 'text',
                inputPlaceholder: 'Player O name',
                showCancelButton: false,
                background: '#333336',
                confirmButtonText: 'Play',
                confirmButtonColor: '#333336',
                customClass: {
                    title: 'alert-content',
                    input: 'alert-input',
                    confirmButton: 'alert-confirm',
                    cancelButton: 'alert-confirm',
                },
                inputValidator: (value) => {
                    if(!value) {
                        return 'You need to write something!'
                    } else {
                        document.querySelector('.player-two').innerText = value;
                    }
                }
            })
        }
    //Player
        const player = (sign) => { //Will define the players
            this.sign = sign;
            const getSign = () => {
                return sign
            }
            return {getSign}
        };
    //Gameboard
        const gameboard = (() => { //Will define the array
            let _gameboard = ["", "", "", "", "", "", "", "", ""];

            const setGameboard = (index, sign) => {
                _gameboard[index] = sign;
                console.log(_gameboard)
            }

            const getGameboard = (index) => {
                return _gameboard[index]
            }

            const reset = () => {
                _gameboard.splice(0);
                console.log(_gameboard)
            }

            return {setGameboard, getGameboard, reset}

        })();
    //Display Controller
        const displayController = (() => { //Will define the DOM events
            let fieldElements = document.querySelectorAll('.field');
            let resetGame = document.querySelector('.reset-gameboard');
            let resetPoints = document.querySelector('.reset-points');
            let currentName = document.querySelector('.current-player')
            let playerOne = document.querySelector('.player-one');
            let playerTwo = document.querySelector('.player-two');
            let scoreP1 = document.querySelector('.score-player1');
            let scoreP2 = document.querySelector('.score-player2')
            let pointsX = 0;
            let pointsO = 0;

            fieldElements.forEach((field) => {
                field.addEventListener('click', (e) => {
                    if(e.target.textContent != '' || gameController.getIsOver()) return;
                    gameController.playRound(parseInt(e.target.dataset.index))
                })
            })

            const domGameboard = (index) => {
                fieldElements[index].textContent = gameboard.getGameboard(index);
                if(gameboard.getGameboard(index) === 'X') {
                    fieldElements[index].style.color = '#39F01F'
                } else {
                    fieldElements[index].style.color = '#00EAD3'
                }
            }

            const turnMessage = (name, style) => {
                currentName.textContent = name + "'s turn";
                currentName.style.color = style;
            }

            const resultMessage = (sign) => {
                if(sign === 'X') {
                    scoreP1.innerText = ''
                    pointsX++;
                    currentName.innerText = playerOne.innerText + ' has won!';
                    scoreP1.innerText = ': ' + pointsX;
                }
                if(sign === 'O') {
                    scoreP2.textContent = '';
                    pointsO++;
                    currentName.textContent = playerTwo.textContent + ' has won!';
                    scoreP2.textContent = ': ' + pointsO;
                }
                if(sign === 'Draw') {
                    currentName.textContent = 'DRAW'
                }
            }

            resetGame.addEventListener('click', () => {
                gameboard.reset();
                gameController.reset();
                for(let i = 0; i < fieldElements.length; i++) {
                    domGameboard(i);
                }
            })

            resetPoints.addEventListener('click', () => {
                scoreP1.textContent = '';
                scoreP2.textContent = '';
                pointsX = 0;
                pointsO = 0;
            })

            return{domGameboard, turnMessage, resultMessage}
        })();
    //Game Controller
        const gameController = (() => { //Will define the gameflow
            let round = 1;
            let name;
            let x = player('X');
            let o = player('O');
            let isOver = false;

            const playRound = (index) => {
                gameboard.setGameboard(index, currentPlayerSign())
                if(checkWinner(index)) {
                    displayController.resultMessage(currentPlayerSign())
                    displayController.domGameboard(index);
                    isOver = true;
                    return;
                }
                if(round === 9) {
                    displayController.resultMessage('Draw');
                    displayController.domGameboard(index);
                    isOver = true;
                    return;
                }
                displayController.domGameboard(index);
                turnName();
                round++;
            };

            const currentPlayerSign = () => {
                return round % 2 === 1 ? x.getSign() : o.getSign();
            }

            const turnName = (name) => {
                if(round % 2 !== 1) {
                    name = document.querySelector('.player-one').innerText;
                    displayController.turnMessage(name, '#39F01F');
                }
                else {
                    name = document.querySelector('.player-two').innerText;
                    displayController.turnMessage(name, '#00EAD3')
                }
            }

            const checkWinner = (index) => {
                const winconditions = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]
                ];

                return winconditions.filter((combinations) => combinations.includes(index)).some((possibleCombination) => possibleCombination.every((index) => gameboard.getGameboard(index) === currentPlayerSign()
                )
                );
            }

            const getIsOver = () => {
                return isOver;
            }

            const reset = () => {
                round = 1;
                isOver = false;
                name = document.querySelector('.player-one').innerText;
                displayController.turnMessage(name, '#39F01F');
            }
            return {playRound, getIsOver, reset, turnName};
        })();
   }
//Player vs Machine
   if(document.querySelector('.score-machine-container') && !document.querySelector('.score-container')) {
    //    const player = () => {
    //         let human = 'X';
    //         let machine = 'O';
    //         let currentPlayerM = human;

    //         const getCurrentPlayer = (player) => {
    //             currentPlayerM = player;
    //         }

    //         const getHuman = () => {
    //             return human;
    //         }

    //         const getMachine = () => {
    //             return machine;
    //         }

    //         return{getCurrentPlayer, getHuman, getMachine};

    //    }


       const gameboardM = (() => {
           const _gameboardM = [0, 1, 2, 3, 4, 5, 6, 7, 8];
           const fieldElementsM = document.querySelectorAll('.fieldM');
           const humanScore = document.querySelector('.score-player');
           const machineScore = document.querySelector('.score-machine');
           const currentPlayer = document.querySelector('.current-player');
           let huPlayer = 'O';
           let aiPlayer = 'X';
           let fc = 0;

           const setGameboardM = (index, sign) => {
            _gameboardM[index] = sign;
            console.log(_gameboardM);
        }

        const getGameboardM = (index) => {
            return _gameboardM[index]
        }

        const emptyIndexies = (board) => {
            return board.filter(s => s != 'O' && s != 'X')
        }
        
        const bestMove = () => {
            let bestSpot = minimax(_gameboardM, aiPlayer);
            setGameboardM(bestSpot.index, aiPlayer);
            domGameboardM(bestSpot.index);
            humanTurn();
        }
        
        const minimax = (newBoard, player) => {
            //add one to function calls
            fc++;
            
            //available spots
            let availSpots = emptyIndexies(newBoard);
          
            // checks for the terminal states such as win, lose, and tie and returning a value accordingly
            if (winning(newBoard, huPlayer)){
               return {score:-10};
            }
              else if (winning(newBoard, aiPlayer)){
              return {score:10};
              }
            else if (availSpots.length === 0){
                return {score:0};
            }
          
          // an array to collect all the objects
            let moves = [];
          
            // loop through available spots
            for (let i = 0; i < availSpots.length; i++){
              //create an object for each and store the index of that spot that was stored as a number in the object's index key
              let move = {};
                move.index = newBoard[availSpots[i]];
          
              // set the empty spot to the current player
              newBoard[availSpots[i]] = player;
          
              //if collect the score resulted from calling minimax on the opponent of the current player
              if (player == aiPlayer){
                let result = minimax(newBoard, huPlayer);
                move.score = result.score;
              }
              else{
                let result = minimax(newBoard, aiPlayer);
                move.score = result.score;
              }
          
              //reset the spot to empty
              newBoard[availSpots[i]] = move.index;
          
              // push the object to the array
              moves.push(move);
            }
          
          // if it is the computer's turn loop over the moves and choose the move with the highest score
            let bestMove;
            if(player === aiPlayer){
              let bestScore = -10000;
              for(let i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                  bestScore = moves[i].score;
                  bestMove = i;
                }
              }
            }else{
          
          // else loop over the moves and choose the move with the lowest score
              let bestScore = 10000;
              for(let i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                  bestScore = moves[i].score;
                  bestMove = i;
                }
              }
            }
          
          // return the chosen move (object) from the array to the higher depth
            return moves[bestMove];
          }
        
        
        
        const winning = (board, player) => {
            if (
                (board[0] == player && board[1] == player && board[2] == player) ||
                (board[3] == player && board[4] == player && board[5] == player) ||
                (board[6] == player && board[7] == player && board[8] == player) ||
                (board[0] == player && board[3] == player && board[6] == player) ||
                (board[1] == player && board[4] == player && board[7] == player) ||
                (board[2] == player && board[5] == player && board[8] == player) ||
                (board[0] == player && board[4] == player && board[8] == player) ||
                (board[2] == player && board[4] == player && board[6] == player)
                ) {
                return true;
            } else {
                return false;
            }
        }

        const humanTurn = () => {
            fieldElementsM.forEach((field) => {
                field.addEventListener('click', (e) => {
                    if(e.target.textContent != '')return;
 
                     // gameControllerM.current(parseInt(e.target.dataset.index))
                     setGameboardM(parseInt(e.target.dataset.index), 'O'); 
                     domGameboardM((e.target.dataset.index));
                     bestMove();
                                
                })
            })
        }



        const domGameboardM = (index) => {
         fieldElementsM[index].textContent = getGameboardM(index);
         if(getGameboardM(index) === 'X') {
             fieldElementsM[index].style.color = '#39F01F'
         } else {
             fieldElementsM[index].style.color = '#00EAD3'
         }
        }

        const resultMessage = (sign) => {
             if(sign === 'X') {
                 humanScore.innerText = ''
                 pointsX++;
                 currentPlayer.innerText = 'The player has won!'
                 humanScore.innerText = ': ' + pointsX;
             }
             if(sign === 'O') {
                 machineScore.textContent = '';
                 pointsO++;
                 currentPlayer.textContent = 'The machine has won!';
                 machineScore.textContent = ': ' + pointsO;
             }
             if(sign === 'TIE!') {
                 currentPlayer.textContent = 'TIE!'
             }
         }

         bestMove();

        return{setGameboardM, getGameboardM, minimax, bestMove}
        
       })();

    //    const displayControllerM = (() => {

    //        const fieldElementsM = document.querySelectorAll('.fieldM');
    //        const human = document.querySelector('.player');
    //        const machine = document.querySelector('.machine');
    //        const humanScore = document.querySelector('.score-player');
    //        const machineScore = document.querySelector('.score-machine');
    //        const currentPlayer = document.querySelector('.current-player');
    //        let pointsX = 0;
    //        let pointsO = 0;

    //        const humanTurn = () => {
    //            fieldElementsM.forEach((field) => {
    //                field.addEventListener('click', (e) => {
    //                    if(e.target.textContent != '')return;
    
    //                     // gameControllerM.current(parseInt(e.target.dataset.index))
    //                     gameboardM.setGameboardM(parseInt(e.target.dataset.index), 'O'); 
    //                     displayControllerM.domGameboardM((e.target.dataset.index));
    //                     gameboardM.bestMove();
                                   
    //                })
    //            })
    //        }



    //        const domGameboardM = (index) => {
    //         fieldElementsM[index].textContent = gameboardM.getGameboardM(index);
    //         if(gameboardM.getGameboardM(index) === 'X') {
    //             fieldElementsM[index].style.color = '#39F01F'
    //         } else {
    //             fieldElementsM[index].style.color = '#00EAD3'
    //         }
    //        }

    //        const resultMessage = (sign) => {
    //             if(sign === 'X') {
    //                 humanScore.innerText = ''
    //                 pointsX++;
    //                 currentPlayer.innerText = 'The player has won!'
    //                 humanScore.innerText = ': ' + pointsX;
    //             }
    //             if(sign === 'O') {
    //                 machineScore.textContent = '';
    //                 pointsO++;
    //                 currentPlayer.textContent = 'The machine has won!';
    //                 machineScore.textContent = ': ' + pointsO;
    //             }
    //             if(sign === 'TIE!') {
    //                 currentPlayer.textContent = 'TIE!'
    //             }
    //         }

    //        return {domGameboardM, resultMessage, humanTurn}

    //    })();

    //    const gameControllerM = (() => {
    //         let isOver = false;
    //         let round = 1;

    //         // const current = (index) => {
    //         //     if(round % 2 == 1) {
    //         //         gameboardM.setGameboardM(index, 'X'); 
    //         //         displayControllerM.domGameboardM(index);
    //         //         round++

    //         //     }
    //         //     if(round % 2 == 0) {
    //         //         gameboardM.bestMove();
    //         //         round++
    //         //     }
    //         // }

    //         // const getIsOverM = () => {
    //         //     return isOver;
    //         // }

    //    })();
   }

}




