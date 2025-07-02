<template>
  <div class="column q-my-sm">
    <StartGame :isGameStarted="isGameStarted" @startGame="startGame" />
    <div v-if="isGameStarted">
      <div class="q-mx-md row">
        <div>
          <div>Score board</div>
          <div v-for="score of sortedScoreboard" :key="score.player">
            Player: {{ score.player }} Score: {{ score.score }}
          </div>
        </div>
        <div class="q-mx-lg">Cards left : {{ randomCardDecks.length }}</div>
      </div>
      <div class="row">
        <q-card
          v-for="(player, index) of players"
          :key="player"
          class="col-md-3 col-sm-5 col-xs-11 q-ma-md"
        >
          <q-card-section>Player : {{ index }}</q-card-section>
          <q-card-section>Card : {{ onGoingResults[index]?.card ?? '' }}</q-card-section>

          <div class="row justify-end" v-if="index === currentPlayer">
            <q-btn
              label="Draw"
              color="primary"
              class="q-ma-sm"
              @click="
                () => {
                  drawCard(index);
                }
              "
            ></q-btn>
            <q-btn
              label="Skip"
              color="negative"
              class="q-ma-sm"
              @click="
                () => {
                  skip();
                }
              "
            ></q-btn>
          </div>
        </q-card>
      </div>
    </div>

    <GameFooter
      :isGameStarted="isGameStarted"
      :onGoingResults="onGoingResults"
      :players="players"
      :randomCardDecks="randomCardDecks"
      :roundHighest="roundHighest"
      :isRoundFinish="isRoundFinish"
      @startNextRound="startNextRound"
      @restartGame="restartGame"
    />
  </div>
</template>

<script setup lang="ts">
import {
  generateCardScoreMapping,
  generateRandomCardDecks,
  generateScoreBoard,
  isCard2Bigger,
  OnGoingResult,
  type Score,
} from './models';
import StartGame from './StartGame.vue';
import GameFooter from './GameFooter.vue';

import { ref, computed } from 'vue';

const cardScoreMapping = generateCardScoreMapping();
const isGameStarted = ref<boolean>(false);
const players = ref<number>(0);
const currentPlayer = ref<number>(0);
const randomCardDecks = ref<string[]>([]);
const scoreboard = ref<Score[]>([]);
const currentHighest = ref<OnGoingResult>({
  player: 0,
  card: '',
});

const onGoingResults = ref<OnGoingResult[]>([]);

const roundHighest = computed(() => {
  const result = [...onGoingResults.value];
  result.sort((a, b) => {
    if (!a.card && !b.card) {
      return 0;
    }
    if (!a.card && b.card) {
      return 1;
    }

    if (a.card && !b.card) {
      return -1;
    }

    return isCard2Bigger(a.card, b.card, cardScoreMapping) ? 1 : -1;
  });

  return result[0];
});

const isRoundFinish = computed(() => {
  return currentPlayer.value % players.value === 0;
});

const sortedScoreboard = computed(() => {
  const _scoreboard = [...scoreboard.value];
  _scoreboard.sort((a, b) => b.score - a.score);
  return _scoreboard;
});

function startGame(dto: { players: number; decks: number }) {
  const { decks, players: _players } = dto;
  randomCardDecks.value = generateRandomCardDecks(decks);
  scoreboard.value = generateScoreBoard(_players);
  isGameStarted.value = true;
  players.value = _players;
  currentPlayer.value = 0;
  currentHighest.value = {
    player: 0,
    card: '',
  };
}

function drawCard(player: number) {
  const ori = [...randomCardDecks.value];
  const [removed] = ori.splice(0, 1);

  randomCardDecks.value = ori;
  if (removed) {
    if (
      !!currentHighest.value.card &&
      isCard2Bigger(currentHighest.value.card, removed, cardScoreMapping)
    ) {
      currentHighest.value.card = removed;
      currentHighest.value.player = player;
    }
    const results = [...onGoingResults.value];
    results[currentPlayer.value] = new OnGoingResult(currentPlayer.value, removed);
    onGoingResults.value = results;
  }
  currentPlayer.value = currentPlayer.value + (1 % players.value);
  if (isRoundFinish.value) {
    calculateScore();
  }
}

function startNextRound() {
  onGoingResults.value = [];
  currentPlayer.value = 0;
}

function skip() {
  const result = [...onGoingResults.value];
  result[currentPlayer.value] = {
    player: 0,
    card: '',
  };
  onGoingResults.value = result;
  currentPlayer.value = currentPlayer.value + (1 % players.value);
}

function calculateScore() {
  const _scoreboard = [...scoreboard.value];
  if (roundHighest.value) {
    _scoreboard[roundHighest.value.player]!.addScore();
    scoreboard.value = _scoreboard;
  }
}

function restartGame() {
  isGameStarted.value = false;
  onGoingResults.value = [];
}
</script>
