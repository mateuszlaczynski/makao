const suits = ["spades", "diamonds", "clubs", "hearts"];
const numbers = ["2", "3", "4", "5", "6", "7","8","9","10","J","Q","K","A"];
let deck = [];
let cardOnTable = null;
let graveyard = [];
let playerDeck = [];
let cpuDeck = []
let moves = 1

function Card(number, suit, color) {
    this.number = number;
    this.suit = suit;
    this.color = color;
    this.symbol = '';
    switch(this.suit) {
        case "spades": 
            this.symbol = "♠";
            break;
        case "diamonds": 
            this.symbol = "♦";
            break;
        case "clubs": 
            this.symbol = "♣";
            break;
        case "hearts": 
            this.symbol = "♥";
            break;
    }
};

//Generate cards in deck
for (let n = 0; n < numbers.length; n++) {
    for(let s = 0; s < suits.length; s++) {
        let number = numbers[n];
        let suit = suits[s];
        if (suits[s] === "spades" || suits[s] === "clubs") {
            var color = "black";
        } else {
            var color = "red";
        };
        deck.push(new Card(number, suit, color));
    }
};

//Shuffle deck "Knock shuffle"
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex],array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array
}

//New game by reloading page
function reloadGame() {
    window.location.reload(true);
}


//Give 5 cards for each player
function fiveCardsForPlayer(array){
    for (let z = 0; z < 5; z++) {
        var card = deck[Math.floor(Math.random() * deck.length)]
        array.push(card);
        for( var i = 0; i < deck.length; i++) { 
            if (deck[i] === card) {
                deck.splice(i,1);
            }
        }
    }
}

//Put random card on empty table
function firstCard() {
    var check = false;
    while (check === false) {
        var card = deck[Math.floor(Math.random() * deck.length)]
        if (card.number !== "J" && card.number !== "Q" &&
        card.number !== "K" && card.number !== "A" && card.number !== "2" && 
        card.number !== "3" && card.number !== "4") {
            cardOnTable = card;
            for( var i = 0; i < deck.length; i++) { 
                if (deck[i] === card) {
                    deck.splice(i,1);
                }
            }
            check = true;
            var cardDiv = document.createElement('div');
            cardDiv.id = card.number;
            cardDiv.id = "card-table";
            cardDiv.innerHTML = `${card.number}${card.symbol}`.fontcolor(card.color);
            document.getElementById("table").appendChild(cardDiv);
        }
    }
}

//Display card on a table no matter if first or another one
function displayTableCard() {
    var card = cardOnTable
    var cardDiv = document.getElementById("card-table")
    cardDiv.innerHTML = `${card.number}${card.symbol}`.fontcolor(card.color);
}

//Adding message to logs
function displayLog(move, message) {
    var cardDiv = document.getElementById("logs")
    cardDiv += cardDiv.innerHTML += `${move}:  ${message}`
    moves++
}

//Take card on command
function takeCards(array, player, amount) {
    for (i=0; i<amount; i++) {
        card = deck[deck.length-1];
        deck.pop(card);
        array.push(card);
    }
    displayLog(moves,`${cardOnTable.number}${cardOnTable.symbol} ${player} takes this amount of cards: ${amount}.<br>`)
    if (player === "player") {
        displayCards(playerDeck, 'player');
        cpuTurn()
    }
    displayCards(cpuDeck, "cpu");
}

//Show or refresh decks on html page
function displayCards(array, div) {
    document.getElementById(div).innerHTML = ""
    for (var i = 0; i < array.length; i++) {
        var card = array[i]
        var cardDiv = document.createElement('div');
        if (array === playerDeck) {
            cardDiv.id = card.number;
            cardDiv.className = "card";
            cardDiv.innerHTML = `${card.number}${card.symbol}`.fontcolor(card.color);
            cardDiv.setAttribute("onclick", `checkCorrectMove('${card.number}', '${card.suit}')`);
        } else {
            cardDiv.className = "card-hidden"; 
            cardDiv.innerHTML = "CPU";
        }

        document.getElementById(div).appendChild(cardDiv); 
    }
}

//This is where computer plays
function cpuTurn() {
    if (deck.length === 0) {
        shuffle(graveyard);
        deck = graveyard
        graveyard = []
        document.getElementById("grave").innerHTML = ""
    }
    
    check = false;
    for (let i = 0; i < cpuDeck.length; i++) {
        var card = cpuDeck[i];
        if (card.number === cardOnTable.number || card.suit === cardOnTable.suit || card.number === "Q") {
            check = true;
            graveyard.push(cardOnTable);
            cardOnTable = card

            for(var z = 0; z < cpuDeck.length; z++) { 
                if (cpuDeck[z] === cardOnTable) {
                    cpuDeck.splice(z,1);
                }
            }
            break;
        }
    }

    if (check === false) {
        takeCards(cpuDeck, "cpu", 1)
    } else {
        if (playerDeck.length === 0) {
            alert("Computer has won!")
            reloadGame()
        } else if (card.number === '2'){
            takeCards(playerDeck, "player", 2);          
        } else if (card.number === '3'){
            takeCards(playerDeck, "player", 3); 
        } else if (card.number === '4') {
            cpuTurn()
            displayLog(moves, `${cardOnTable.number}${cardOnTable.symbol} player misses his turn.<br>`)
        } else if (card.number === "K" && (card.suit === "spades" || card.suit === "hearts")) {
            takeCards(playerDeck, "player", 5)
        } else {
            displayLog(moves, `${cardOnTable.number}${cardOnTable.symbol} player's turn.<br>`)
        }
    }


    displayCards(cpuDeck, "cpu");
    displayTableCard();
}

//This functions checks if player made a correct move
function checkCorrectMove(number, suit) {
    if (deck.length === 0) {
        shuffle(graveyard);
        deck = graveyard
        graveyard = []

    }
    
    var check = false;
    var deckIndex = 0;
    while (check === false || deckIndex > playerDeck.length) {
        if (playerDeck[deckIndex].number == number && playerDeck[deckIndex].suit == suit) {
            var card = playerDeck[deckIndex];
            check = true;
            console.log(check)
        }
        deckIndex++;
    }

    if (card.number === cardOnTable.number || card.symbol === cardOnTable.symbol || card.number === "Q") {
        graveyard.push(cardOnTable);
        cardOnTable = card


        for(var z = 0; z < cpuDeck.length; z++) { 
            if (playerDeck[z] === cardOnTable) {
                playerDeck.splice(z,1);
            }
        }
        displayTableCard()
        displayCards(playerDeck, 'player');
        if (playerDeck.length === 0) {
            alert("You have won!")
            reloadGame()
        } else if (card.number === '2'){
            takeCards(cpuDeck, "cpu", 2);          
        } else if (card.number === '3'){
            takeCards(cpuDeck, "cpu", 3); 
        } else if (card.number === '4') {
            displayLog(moves, `${cardOnTable.number}${cardOnTable.symbol} cpu misses his turn.<br>`)
        } else if (card.number === "K" && (card.suit === "spades" || card.suit === "hearts")) {
            takeCards(cpuDeck, "cpu", 5)
        }
        else {
            displayLog(moves, `${cardOnTable.number}${cardOnTable.symbol} cpu's turn.<br>`)
            cpuTurn()
        }

    } else {
        alert('Wrong move! Chose anoter card or take one from the deck')
    }   
     
}

//game
shuffle(deck)
fiveCardsForPlayer(playerDeck);
fiveCardsForPlayer(cpuDeck);
displayCards(cpuDeck, "cpu");
firstCard();
displayCards(playerDeck, 'player');
