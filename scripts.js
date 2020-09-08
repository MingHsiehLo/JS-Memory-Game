const grid = document.querySelector(".grid");
const reset = document.getElementsByClassName('reset');
const pyro = document.getElementsByClassName('pyro');
const resetDOM = document.getElementsByClassName('fa-undo-alt');
resetDOM[0].addEventListener('click', resetGame);

// Deal the cards
const cardsArray = [
  { name: "fish", img: "img/carp-fish.svg" },
  { name: "daruma", img: "img/daruma.svg" },
  { name: "ninja", img: "img/ninja.svg" },
  { name: "omamori", img: "img/omamori.svg" },
  { name: "origami", img: "img/origami.svg" },
  { name: "sushi", img: "img/sushi.svg" }
]
.reduce((acc, element) => [...acc, element, element], []);

shuffleArray(cardsArray);

// Variables to track the flipped card and its information
let cardFlipped = 0;
const flippedArrId = [];

// A map object to store the info related to the id and its name
const allCardsInfo = new Map();

// Variable to track the results of the game
let resultDOM = document.getElementById('result');
let result = 0;
let movementsDOM = document.getElementById('movements');
let movements = 0;

// Function attached to the card to flip it and check up if it's the right pair or not
function clickedId() {
  if (+flippedArrId[0] === +this.id) return null;
  if (cardFlipped >= 2) return null;

  cardFlipped++;
  movements++;
  movementsDOM.innerText = movements;
  document.getElementById(this.id).classList.add('flip');
  flippedArrId.push(this.id);

  // If there two flipped cards, check out if the name matches
  if (flippedArrId.length === 2) {
    // Used a setTimeOut so the user can see the cards that are flipping
    setTimeout(() => {
      // If the card name matches, save its info and make the cards invisible
      if (allCardsInfo.get(flippedArrId[0]) === allCardsInfo.get(flippedArrId[1])) {
        result++;
        resultDOM.innerText = result;
        cardFlipped = 0;
        flippedArrId.forEach(el => {
          document.getElementById(el).classList.add('invisible');
          document.getElementById(el).removeEventListener('click', clickedId);
        });
        flippedArrId.splice(0, flippedArrId.length);

        // When the game is over, display a congrats message and allow the user to reset the game
        if (result === 6) {
          grid.classList.add('invisible');
          reset[0].classList.add('invisible');
          pyro[0].classList.remove('invisible');
          document.querySelector('body').classList.add('overflow-hidden');
          setTimeout(() => {
            pyro[0].classList.add('invisible');
            document.querySelector('body').classList.remove('overflow-hidden');
          }, 7000);
          const congratsText = document.getElementById('congrats-text');
          congratsText.classList.add('congrats');
          const congratsMessage = document.createElement('p');
          congratsMessage.innerHTML = 'Congratulations!';
          const congratsIcon = document.createElement('p');
          congratsIcon.innerHTML = '<i class="fas fa-glass-cheers"></i>';
          const movementsMessage = document.createElement('p');
          movementsMessage.setAttribute('id', 'text-movement');
          movementsMessage.innerHTML = `You finished the game with ${movements} movements.`;
          congratsText.innerHTML = '';
          congratsText.appendChild(congratsMessage);
          congratsText.appendChild(congratsIcon);
          congratsText.appendChild(movementsMessage);
          const retryBtn = document.createElement('button');
          retryBtn.innerText = 'Play Again';
          retryBtn.addEventListener('click', () => {
            resetGame();
          });
          congratsText.appendChild(retryBtn);
        }
      }
      // If it doesn't match, flip down the cards again
      else {
        flippedArrId.forEach(el => {
          document.getElementById(el).classList.remove('flip');
        })
        cardFlipped = 0;
        flippedArrId.splice(0,flippedArrId.length);
      }
    }, 900);
  }
}

// Function to fill cards grid and to call it when we need to re-fill the grid on reset
function fillGrid(){
  cardsArray.forEach(({ img, name }, idx) => {
    // Back-side img
    const cardBack = document.createElement('img');
    cardBack.setAttribute('src', img);
    cardBack.classList.add(name);
    // Front-side img
    const cardFront = document.createElement('img');
    cardFront.setAttribute("src", "img/fuji.svg");
    // Element needed for the flip animation with the information of the card
    const memoryCard = document.createElement('div');
    memoryCard.classList.add('memory-card');
    memoryCard.setAttribute('id', idx);
    memoryCard.addEventListener('click', clickedId);
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper');
    // Saved the name into the map object
    allCardsInfo.set(`${idx}`, name);

    // The back-side of the card
    cardBack.classList.add('front-face');
    // The front-side of the card
    cardFront.classList.add('back-face');

    // Build the correct order of DOM elements
    memoryCard.appendChild(cardBack);
    memoryCard.appendChild(cardFront);
    cardWrapper.appendChild(memoryCard);
    grid.appendChild(cardWrapper);
  });
  const allCards = document.getElementsByClassName('card-wrapper');
  for (let el of allCards) {
    el.classList.add('animation');
  }
  setTimeout(() => {
    for (let el of allCards) {
      el.classList.remove('animation');
    }
  }, 800);
}

fillGrid();

// Shuffle array function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to reset all the game and start from zero
function resetGame(){
  grid.classList.remove('invisible');
  reset[0].classList.remove('invisible');
  result = 0;
  movements = 0;
  cardFlipped = 0;
  flippedArrId.splice(0, flippedArrId.length);
  document.getElementById('congrats-text').classList.remove('congrats');
  resultDOM.innerText = result;
  movementsDOM.innerText = movements;
  shuffleArray(cardsArray);
  grid.innerHTML = '';
  fillGrid();
}