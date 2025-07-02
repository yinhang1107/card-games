export class Score {
  player: number;
  score: number

  constructor(player: number, score = 0) {
    this.player = player
    this.score = score
  }

  addScore() {
    this.score += 1
  }
}

export class OnGoingResult {
  player: number;
  card: string

  constructor(player: number, card = '') {
    this.player = player
    this.card = card
  }
}


function generateCardDecks(num = 1) {
  const cardDecks: string[] = []
  const cardType = ["Spade", "Heart", "Club", "Diamond"]
  const cardRuningNumber = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
  cardRuningNumber.forEach((num) => {
    cardType.forEach((type) => {
      cardDecks.push(`${num}-${type}`)
    })
  })

  if (num > 1) {
    for (let index = 0; index < num - 1; index++) {
      cardDecks.push(...cardDecks)
    }
  }

  return cardDecks
}


export function generateRandomCardDecks(num = 1): string[] {
  const cardDecks: string[] = generateCardDecks(num);
  function fisherYatesShuffle() {
    const shuffled: any[] = [...cardDecks]; // Create a copy to avoid mutating original

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [(shuffled[i]), (shuffled[j])] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    return shuffled;
  }

  return fisherYatesShuffle()
}

export function generateCardScoreMapping() {
  const decks = generateCardDecks();
  const cardScoreMapping: Record<string, number> = {}

  decks.forEach((card, index) => {
    cardScoreMapping[`${card}`] = index + 1;
  })

  return cardScoreMapping
}

export function generateScoreBoard(players: number) {
  const scoreboard: Score[] = [];
  for (let index = 0; index < players; index++) {
    scoreboard.push(new Score(index))
  }

  return scoreboard
}

export function isCard2Bigger(card1: string, card2: string, cardScoreMapping: Record<string, number>) {
  const card1Point = cardScoreMapping[card1];
  const card2Point = cardScoreMapping[card2];

  if (!card1Point || !card2Point) {
    throw new Error(`Invalid cardPoint - ${card1Point} - ${card2Point}`)
  }

  return card2Point > card1Point
}

function cardGames(players = 4, _decks = 1) {
  const decks = generateRandomCardDecks(_decks);
  const scoreboard: Score[] = generateScoreBoard(players)
  const cardScoreMapping = generateCardScoreMapping()

  let currentHighest = {
    player: 0,
    card: ''
  }
  for (let index = 0; index < decks.length; index++) {
    const card = decks[index];
    if (!card) {
      throw new Error(`Invalid card - ${card}`)
    }

    const playerNumber = index % players;
    const isFirstPlayer = playerNumber === 0
    if (isFirstPlayer) {
      currentHighest = {
        card,
        player: index % 4
      }
      continue;
    }

    if (isCard2Bigger(currentHighest.card, card, cardScoreMapping)) {
      currentHighest.card = card;
      currentHighest.player = playerNumber
    }

    const isRoundFinish = playerNumber === 3
    if (isRoundFinish) {
      scoreboard[currentHighest.player]!.addScore();
    }
  }

  return scoreboard
}

// const result = cardGames()

// result.sort((a, b) => b.score - a.score)

// console.log(result);





