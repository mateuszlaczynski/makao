const suits = ["spades", "diamonds", "clubs", "hearts"];
const numbers = ["2", "3", "4", "5", "6", "7","8","9","10","J","Q","K","A"];
let deck = [];
let cardOnTable = null;
let graveyard = [];
let playerDeck = [];
let cpuDeck = []

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
            cardDiv.className = "card";
            cardDiv.innerHTML = `${card.number}${card.symbol}`.fontcolor(card.color);
            document.getElementById("table").appendChild(cardDiv);
        }
    }
}

//Show cards on html page
function displayCards(array, div) {
    document.getElementById(div).innerHTML = ""
    for (var i = 0; i < array.length; i++) {
        var card = array[i]
        var cardDiv = document.createElement('div');
        cardDiv.id = card.number;
        cardDiv.className = "card";
        cardDiv.innerHTML = `${card.number}${card.symbol}`.fontcolor(card.color);
        cardDiv.setAttribute("onclick", `checkCorrectMove('${card.number}', '${card.suit}')`);
        document.getElementById(div).appendChild(cardDiv); 
    }
}

function cpuTurn() {
    check = false;
    for (let i = 0; i < cpuDeck.length; i++) {
        if (cpuDeck[i].number === cardOnTable.number || cpuDeck[i].suit === cardOnTable.suit) {
            check = true;
            graveyard.push(cardOnTable);
            cardOnTable = cpuDeck[i]
            var cardDiv = document.createElement('div');
            cardDiv.className = "card-hidden";
            cardDiv.id = "grave"
            cardDiv.innerHTML = "Grave";
            document.getElementById("table").appendChild(cardDiv); 

            for(var z = 0; z < cpuDeck.length; z++) { 
                if (cpuDeck[z] === cardOnTable) {
                    cpuDeck.splice(z,1);
                }
            }
            break;
        }
    }
    if (check === false) {
            card = deck[deck.length-1];
            deck.pop(card);
            cpuDeck.push(card);
    }
    displayCards(cpuDeck, "cpu");
}

function checkCorrectMove(number, suit) {
    var check = false;
    var deckIndex = playerDeck.length-1;
    while (check === false || deckIndex <= 0) {
        console.log(deckIndex)
        if (playerDeck[deckIndex].number == number && playerDeck[deckIndex].suit == suit) {
            var card = playerDeck[deckIndex];
            check = true;
            console.log(check)
        }
        deckIndex--;
    }
    if (check === true) {
        alert("Incorrect choice, try again or take anoter card!")
    }
    
}

//game
shuffle(deck)
fiveCardsForPlayer(playerDeck);
fiveCardsForPlayer(cpuDeck);
displayCards(cpuDeck, "cpu");
firstCard();
displayCards(playerDeck, 'player');
cpuTurn();

if (deck.length === 0) {
    shuffle(graveyard);
    deck = graveyard
    graveyard = []
    document.getElementById("grave").innerHTML = ""
}

console.log(deck)
console.log(playerDeck)
console.log(cpuDeck)
console.log(cardOnTable)
console.log(graveyard)