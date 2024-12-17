class Blackjack {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.playerScore = 0;
        this.dealerScore = 0;
        this.playerMoney = 1000;
        this.currentBet = 0;
        this.gameInProgress = false;

        // DOM Elements
        this.dealButton = document.getElementById('deal-button');
        this.hitButton = document.getElementById('hit-button');
        this.standButton = document.getElementById('stand-button');
        this.doubleButton = document.getElementById('double-button');
        this.playerCardsContainer = document.getElementById('player-cards');
        this.dealerCardsContainer = document.getElementById('dealer-cards');
        this.playerScoreElement = document.getElementById('player-score');
        this.dealerScoreElement = document.getElementById('dealer-score');
        this.gameResultElement = document.getElementById('game-result');
        this.playerMoneyElement = document.getElementById('player-money');
        this.betAmountElement = document.getElementById('bet-amount');
        this.chips = document.querySelectorAll('.chip');

        this.initializeEventListeners();
        this.updateMoneyDisplay();
    }

    initializeEventListeners() {
        this.dealButton.addEventListener('click', () => this.startGame());
        this.hitButton.addEventListener('click', () => this.playerHit());
        this.standButton.addEventListener('click', () => this.playerStand());
        this.doubleButton.addEventListener('click', () => this.playerDouble());
        
        this.chips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (!this.gameInProgress) {
                    const value = parseInt(chip.dataset.value);
                    if (this.playerMoney >= value) {
                        this.currentBet += value;
                        this.playerMoney -= value;
                        this.updateMoneyDisplay();
                        this.dealButton.disabled = false;
                    }
                }
            });
        });
    }

    createDeck() {
        const suits = ['♠', '♣', '♥', '♦'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];

        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ value, suit });
            }
        }

        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    calculateScore(hand) {
        let score = 0;
        let aces = 0;

        for (let card of hand) {
            if (['J', 'Q', 'K'].includes(card.value)) {
                score += 10;
            } else if (card.value === 'A') {
                aces++;
            } else {
                score += parseInt(card.value);
            }
        }

        for (let i = 0; i < aces; i++) {
            if (score + 11 <= 21) {
                score += 11;
            } else {
                score += 1;
            }
        }

        return score;
    }

    startGame() {
        if (this.currentBet === 0) return;
        
        this.gameInProgress = true;
        this.createDeck();
        this.playerHand = [];
        this.dealerHand = [];
        this.playerCardsContainer.innerHTML = '';
        this.dealerCardsContainer.innerHTML = '';
        
        // Only update game result if the element exists
        if (this.gameResultElement) {
            this.gameResultElement.textContent = '';
            this.gameResultElement.className = '';
        }

        this.dealInitialCards();

        this.dealButton.disabled = true;
        this.hitButton.disabled = false;
        this.standButton.disabled = false;
        this.doubleButton.disabled = this.playerMoney < this.currentBet;
    }

    dealInitialCards() {
        this.playerHit();
        this.dealerHit();
        this.playerHit();
        this.dealerHit(true);

        if (this.calculateScore(this.playerHand) === 21) {
            this.playerBlackjack();
        }
    }

    playerHit() {
        const card = this.deck.pop();
        this.playerHand.push(card);
        this.renderCard(card, this.playerCardsContainer, false, true);
        this.playerScore = this.calculateScore(this.playerHand);
        this.playerScoreElement.textContent = `Score: ${this.playerScore}`;

        if (this.playerScore > 21) {
            this.endGame('Bust! Dealer wins.', 'lose');
        }
    }

    dealerHit(hidden = false) {
        const card = this.deck.pop();
        this.dealerHand.push(card);
        this.renderCard(card, this.dealerCardsContainer, hidden, false);
        
        if (!hidden) {
            this.dealerScore = this.calculateScore(this.dealerHand);
            this.dealerScoreElement.textContent = `Score: ${this.dealerScore}`;
        }
    }

    renderCard(card, container, hidden = false, isPlayer = true) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        if (hidden) {
            cardElement.classList.add('hidden');
            cardElement.textContent = '?';
        } else {
            // Add suit classes for color
            if (['♥', '♦'].includes(card.suit)) {
                cardElement.classList.add('hearts');
            } else {
                cardElement.classList.add('spades');
            }

            // Create and add top value element
            const topValue = document.createElement('div');
            topValue.classList.add('value', 'top-value');
            topValue.textContent = card.value;
            cardElement.appendChild(topValue);

            // Create and add bottom value element
            const bottomValue = document.createElement('div');
            bottomValue.classList.add('value', 'bottom-value');
            bottomValue.textContent = card.value;
            cardElement.appendChild(bottomValue);

            // Create and add suit element
            const suitElement = document.createElement('div');
            suitElement.classList.add('suit');
            suitElement.textContent = card.suit;
            cardElement.appendChild(suitElement);
        }

        container.appendChild(cardElement);
        
        // Add animation
        cardElement.style.opacity = '0';
        cardElement.style.transform = `translateY(${isPlayer ? '50px' : '-50px'})`;
        setTimeout(() => {
            cardElement.style.transition = 'all 0.3s ease';
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, 50);
    }

    playerDouble() {
        if (this.playerMoney >= this.currentBet) {
            this.playerMoney -= this.currentBet;
            this.currentBet *= 2;
            this.updateMoneyDisplay();
            this.playerHit();
            if (this.playerScore <= 21) {
                this.playerStand();
            }
        }
        this.doubleButton.disabled = true;
    }

    playerBlackjack() {
        this.playerMoney += this.currentBet * 2.5;
        this.endGame('Blackjack! You win!', 'win');
    }

    playerStand() {
        this.hitButton.disabled = true;
        this.standButton.disabled = true;
        this.doubleButton.disabled = true;

        // Reveal dealer's hidden card
        this.dealerCardsContainer.innerHTML = '';
        for (let card of this.dealerHand) {
            this.renderCard(card, this.dealerCardsContainer, false, false);
        }
        this.dealerScore = this.calculateScore(this.dealerHand);
        this.dealerScoreElement.textContent = `Score: ${this.dealerScore}`;

        this.dealerPlay();
    }

    dealerPlay() {
        const dealerPlayTurn = () => {
            const hasAce = this.dealerHand.some(card => card.value === 'A');
            const dealerScore = this.calculateScore(this.dealerHand);

            // Stop if dealer busts
            if (dealerScore > 21) {
                this.determineWinner();
                return;
            }
            
            // If dealer has an Ace and score is 17 or less, keep hitting
            if (hasAce && dealerScore <= 17) {
                this.dealerHit();
                setTimeout(dealerPlayTurn, 500);
            }
            // If dealer has a "soft" 18 (Ace + 7), hit to try to improve
            else if (hasAce && dealerScore === 18 && this.dealerHand.length === 2) {
                this.dealerHit();
                setTimeout(dealerPlayTurn, 500);
            }
            // Without an Ace, use normal strategy (stop at 17 or higher)
            else if (!hasAce && dealerScore < 17) {
                this.dealerHit();
                setTimeout(dealerPlayTurn, 500);
            }
            // Otherwise stand
            else {
                this.determineWinner();
            }
        };

        setTimeout(dealerPlayTurn, 500);
    }

    determineWinner() {
        if (this.dealerScore > 21) {
            this.playerMoney += this.currentBet * 2;
            this.endGame('Dealer busts! You win!', 'win');
        } else if (this.playerScore > this.dealerScore) {
            this.playerMoney += this.currentBet * 2;
            this.endGame('You win!', 'win');
        } else if (this.playerScore < this.dealerScore) {
            this.endGame('Dealer wins!', 'lose');
        } else {
            this.playerMoney += this.currentBet;
            this.endGame('It\'s a tie!', 'tie');
        }
    }

    endGame(message, result) {
        // Only update game result if the element exists
        if (this.gameResultElement) {
            this.gameResultElement.textContent = message;
            this.gameResultElement.className = result;
        }
        
        this.hitButton.disabled = true;
        this.standButton.disabled = true;
        this.doubleButton.disabled = true;
        this.dealButton.disabled = false;
        this.gameInProgress = false;
        this.currentBet = 0;
        this.updateMoneyDisplay();

        if (this.playerMoney === 0) {
            setTimeout(() => {
                alert('Game Over! You\'re out of money. Refreshing the page will start a new game.');
            }, 500);
        }
    }

    updateMoneyDisplay() {
        this.playerMoneyElement.textContent = `Your Money: $${this.playerMoney}`;
        this.betAmountElement.textContent = `Current Bet: $${this.currentBet}`;
        this.dealButton.disabled = this.currentBet === 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Blackjack();
});
