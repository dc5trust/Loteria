const cardImages = [];
const cardsContainer = document.querySelector('.cards');
const cardImage = document.querySelector('.card-image');
const tableLoteria = document.querySelector('.table-loteria');
const boxes = document.querySelectorAll('.box');
const computerBoxes = document.querySelectorAll('.computer');
const userBoxes = document.querySelectorAll('.user');
const displayTimer = document.querySelector('.card-timer');
const ComputerScore = document.querySelector('.computer-score');
const gameStatus = document.querySelector('.game-status');
const dots = document.querySelectorAll('.dot');
//buttons 
const newGameBtn = document.querySelector('#new-game-btn');

//global variables
let hasCreatedNumArray = false;
let durationBetweenCards = 5; //5
let nonRepeatingNumbers;
let currentCardShown;
let counts = 0;
let randomInProgress = false;
let gameTimer;
let computerMatchCount = 0;

insertImagesToArray();
renderBothTables();

cardImage.addEventListener('click', beginGame);
newGameBtn.addEventListener('click', refreshGame);

function refreshGame(){
    location.reload();
}

function randomCard (){
    let randomNumber;
        if(nonRepeatingNumbers.length > 0){
            randomNumber = Math.floor(Math.random() * nonRepeatingNumbers.length);
            cardImage.src = cardImages[nonRepeatingNumbers[randomNumber]-1];
            currentCardShown = nonRepeatingNumbers[randomNumber];
            findComputerMatches();
            findUserMatches();
            nonRepeatingNumbers.splice(randomNumber, 1);
        }else{
            cardImage.src = "./images/back.png";
        }
}


function findComputerMatches (){
    computerBoxes.forEach((box)=>{
        const matchedElement = box.classList[1];
        const computerClickedElement = box.classList[3]
        if(currentCardShown === parseInt(box.firstChild.classList[1])){
            computerMatchCount++;
            ComputerScore.innerText = `CPU Score: ${computerMatchCount}/16`;
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.classList.add('dot-computer');
            box.append(dot);
            if(computerMatchCount === 16){
                const dotsComputer  = document.querySelectorAll('.dot-computer');
                dotsComputer.forEach(changeDotsColor);
                clearInterval(gameTimer);
                gameStatus.textContent = `The Computer has won the Game!`;
                // randomInProgress = !randomInProgress;
            }
        }
    });
}

function findUserMatches(){
    userBoxes.forEach((box)=>{
        if(currentCardShown === parseInt(box.firstChild.classList[1])){
            box.classList.add('matched');
        }
    });
}

function hasUserWon(){
    let matchCount = 0;
    userBoxes.forEach((box)=>{
        const matchedElement  = box.classList[2];
        const userClickedElement = box.classList[3];
        //we need sibiling to compare
        if(matchedElement === 'matched' && userClickedElement === 'user-marked'){
            matchCount++;
            if(matchCount === 16){
                const dotsUser = document.querySelectorAll('.dot-user');
                dotsUser.forEach(changeDotsColor);
                clearInterval(gameTimer);
                gameStatus.textContent = `Congratulations! You've won the Game!`;
            }else if(matchCount < 16){
                return
                //no winner has been declared!
            }
        }else{
            return
        }
    });
}


function changeDotsColor (dot, index){
    setTimeout(()=>{
        dot.style.border = '10px gold solid';
        dot.style.backgroundColor = 'transparent';
        dot.style.opacity = 1;
    }, 100 * index);
}

function beginGame(){
    //initial click before entering setInterval
    
    if(randomInProgress === false){
    randomInProgress = !randomInProgress;
    nonRepeatingNumbers = createArrayOfNumbers();
    randomCard();
    gameStatus.textContent = 'Playing...';
    let start = Date.now();
    let tenSecondIntervals = 1;
    gameTimer = setInterval(()=>{
        const millis = Math.floor((Date.now() - start)/1000);
        const countDown = (durationBetweenCards * tenSecondIntervals) - millis;
        if(countDown >= 0){
            displayTimer.innerHTML = `00:0${countDown} Seconds`;
            if((countDown) === 0){
                tenSecondIntervals++;
                durationBetweenCards = 5;
                randomCard();
            }
        } 
    }, 1000);
    }
    
}


function insertImagesToArray(){
    for(let i = 1; i <= 54; i++){
        cardImages.push(`./images/${i}.jpg`);
    }
}



function renderBothTables(){
    //create two unique tablas( player cards )
    let nonRepeatingNums = createArrayOfNumbers();

    createTableCards(userBoxes, nonRepeatingNums);
    createTableCards(computerBoxes, nonRepeatingNums);
}

function createArrayOfNumbers(){
    let numbers = [];
    let i = 1;
    while(i <= 54){
        numbers.push(i);
        i++;
    }
    return numbers;
}

function createTableCards (tableSelection, nonRepeatingNums){
    // let nonRepeatingNums = createArrayOfNumbers();
    
   
    tableSelection.forEach((box, index)=>{
        const randomNumber = Math.floor(Math.random() * nonRepeatingNums.length);
        const imgElement = document.createElement('img');
        imgElement.src =  cardImages[nonRepeatingNums[randomNumber]-1];
        imgElement.classList.add('table-images');
        imgElement.classList.add(`${nonRepeatingNums[randomNumber]}`);
        nonRepeatingNums.splice(randomNumber, 1);
        box.append(imgElement);
    });

}


userBoxes.forEach((box)=>{
    box.addEventListener('click', (event)=>{
            const userBox = event.target.parentElement;
        if(userBox.classList[2] === 'matched'){
            const dot = document.createElement('div');
            if(event.target.classList[0] === 'dot'){
                return
            }else if(event.target.classList[0] === 'table-images' ){
                dot.classList.add('dot');
                dot.classList.add('dot-user');
                box.classList.add('user-marked');
                box.append(dot);
                hasUserWon();
            }
        }
    })
});

