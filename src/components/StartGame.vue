<template>
  <div v-if="!isGameStarted">
    <div>Card games</div>
    <q-input
      outlined
      v-model="players"
      label="Players"
      type="number"
      :rules="[(val) => val >= 1 || 'Must be greater than 1 player']"
    />
    <q-input
      outlined
      v-model="decks"
      label="Decks"
      type="number"
      :rules="[(val) => val >= 1 || 'Must be greater than 1 deck']"
    />

    <q-btn
      v-if="!isGameStarted"
      color="primary"
      label="Start"
      class="q-my-md"
      @click="
        () => {
          startGame();
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const players = ref<number>(8);
const decks = ref<number>(2);

const props = defineProps({
  isGameStarted: {
    type: Boolean,
  },
});

const emits = defineEmits<{
  (event: 'start-game', dto: { players: number; decks: number }): void;
}>();

function startGame() {
  if (players.value > 0 && decks.value > 0) {
    emits('start-game', { players: Number(players.value), decks: Number(decks.value) });
  }
}
</script>
