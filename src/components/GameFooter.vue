<template>
  <div class="row q-mt-lg" v-if="canStartNextRound && canShowNextRoundButton">
    <div class="col q-mx-md">
      <div class="text-bold">Round highest</div>
      <div>Player : {{ roundHighest?.player }}</div>
      Card : {{ roundHighest?.card }}
    </div>
    <div class="q-mx-md col">
      <q-btn label="Start next round" @click="startNextRound"></q-btn>
    </div>
  </div>
  <div v-else-if="isGameStarted && isRoundFinish && !canStartNextRound">
    <q-btn label="Restart game" @click="restartGame"></q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

import { type OnGoingResult } from './models';
const props = defineProps({
  isGameStarted: {
    type: Boolean,
  },
  isRoundFinish: {
    type: Boolean,
  },
  onGoingResults: {
    type: Array as PropType<OnGoingResult[]>,
  },
  players: {
    type: Number,
  },
  randomCardDecks: {
    type: Array as PropType<string[]>,
  },
  roundHighest: {
    type: Object as PropType<OnGoingResult | undefined>,
  },
});

const emits = defineEmits<{
  (event: 'start-next-round'): void;
  (event: 'restart-game'): void;
}>();

function startNextRound() {
  emits('start-next-round');
}

function restartGame() {
  emits('restart-game');
}

const canShowNextRoundButton = computed(() => {
  return props.isGameStarted && props.onGoingResults?.length === props.players;
});

const canStartNextRound = computed(() => {
  return (props.randomCardDecks?.length ?? 0) >= (props.players ?? 0);
});
</script>
