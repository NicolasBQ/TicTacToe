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
       const player = (sign) => {
           this.sign = this.sign
           const getSign = () => {
               return sign
           }

           return{getSign}

       }

       const gameboardM = (() => {
           const _gameboardM = ["", "", "", "", "", "", "", ""];
           let bestScore = -Infinity;
           let bestMoveM;

           const setGameboardM = (index, sign) => {
            _gameboardM[index] = sign;
            console.log(_gameboardM);
        }

        const getGameboardM = (index) => {
            return _gameboardM[index]
        }

        const bestMove = () => {
            for(let i = 0; i < _gameboardM.length; i++) {
                if(_gameboardM[i] == '') {
                    let score = minimax(_gameboardM);
                    if(score > bestScore) {
                        bestScore = score;
                        setGameboardM(i, 'O');
                        displayControllerM.domGameboardM(i);
                    }
                }
            }
        }

        const minimax = (gameboard) =>{
           return 1;
        }

        return{setGameboardM, getGameboardM, bestMove}

       })();

       const displayControllerM = (() => {
           const fieldElementsM = document.querySelectorAll('.fieldM');

           fieldElementsM.forEach((field) => {
               field.addEventListener('click', (e) => {
                   if(e.target.textContent != '')return;
                    gameControllerM.playRound(parseInt(e.target.dataset.index));
               })
           })


           const domGameboardM = (index) => {
            fieldElementsM[index].textContent = gameboardM.getGameboardM(index);
            if(gameboardM.getGameboardM(index) === 'X') {
                fieldElementsM[index].style.color = '#39F01F'
            } else {
                fieldElementsM[index].style.color = '#00EAD3'
            }
           }

           return {domGameboardM}

       })();

       const gameControllerM = (() => {
            const fieldElementsM = document.querySelectorAll('.fieldM');
            let bestScore = -Infinity;

            const playRound = (index) => {
                gameboardM.setGameboardM(index, 'X');
                displayControllerM.domGameboardM(index);
                gameboardM.bestMove();
            }

            // const currentPlayer = () => {
            //     return round % 2 === 1 ? x.getSign() : bestMove();
            // }


            return{playRound}

       })();
   }

}




