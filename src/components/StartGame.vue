<template>
  <div v-if="!isGameStarted">Card games</div>
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
  emits('start-game', { players: players.value, decks: decks.value });
}
</script>
