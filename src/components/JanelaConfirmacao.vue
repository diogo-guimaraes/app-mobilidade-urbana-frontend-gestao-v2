<template>
  <q-dialog v-model="model">
    <q-card>
      <q-card-section>
        <slot></slot>
      </q-card-section>

      <q-card-actions align="center">
        <div class="row q-gutter-md">
          <div class="col">
            <q-btn class="q-px-md" label="Não" color="red" @click="close" />
          </div>
          <div class="col">
            <q-btn class="q-px-md" label="Sim" color="green" @click="submit" />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm'])

const props = defineProps({
  modelValue: Boolean,
  usuario: [Object],
})

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function close() {
  emit('cancel')
  model.value = false
}

function submit() {
  emit('confirm')
  model.value = false
}
</script>
