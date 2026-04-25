<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow">
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-toolbar>
          <q-avatar rounded size="md" icon="upload_file" color="primary" text-color="white" />
          <q-toolbar-title>
            <span class="text-weight-bold">Upload de arquivo</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator />

        <q-card-section>
          <q-file
            filled
            bottom-slots
            v-model="file"
            label="Selecione o arquivo"
            counter
            max-files="12"
          >
            <template v-slot:before>
              <q-icon name="folder_open" />
            </template>

            <template v-slot:hint> Field hint </template>

            <template v-slot:append>
              <q-btn round dense flat icon="add" @click.stop.prevent />
            </template>
          </q-file>
          <q-btn
            v-if="file"
            @click="request()"
            label="Enviar"
            color="primary"
            class="full-width q-mt-md"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

// PROPS
const props = defineProps({
  modelValue: Boolean,
})

// EMITS
const emit = defineEmits(['update:modelValue'])

// QUASAR
const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// STATE
const file = ref(null)
// COMPUTED

// LIFECYCLE
function beforeShow() {
  file.value = null
}

// ACTION

function request() {
  const data = new FormData()
  if (file.value) data.append('arquivo', file.value)
  data.append('motorista_id', 1)
  data.append('documento', 'CNH')
  api
    .post('/motorista-documentos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      $q.notify({ type: 'positive', message: res.data.message })
      emit('onRequest')
      model.value = false
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err.response?.data?.message })
    })
}
</script>
