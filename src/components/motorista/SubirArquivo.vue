<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow">
      <q-card style="width: 700px; max-width: 80vw">
        <!-- HEADER -->
        <q-toolbar>
          <!-- <q-avatar rounded size="lg" icon="file_present" color="primary" text-color="white" /> -->
          <q-toolbar-title>
            <span class="text-weight-bold">Enviar documento</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <!-- <pre>
      {{ documento.value }}
    </pre
        > -->
        <q-separator />
        <div class="q-pa-md">
          <q-card-section>
            <q-item>
              <q-item-section top avatar>
                <q-avatar icon="attach_file" size="xl" rounded> </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6"> {{ documento.value.titulo }}</q-item-label>
                <q-item-label class="estilo-coluna" caption>
                  {{ documento.value.descricao }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-file
              class="q-mt-lg"
              filled
              bottom-slots
              v-model="file"
              label="Selecione o arquivo"
              counter
              max-files="1"
            >
              <template v-slot:before>
                <q-icon name="upload_file" />
              </template>
              <template v-slot:append>
                <q-btn round dense flat icon="add" @click.stop.prevent />
              </template>
            </q-file>
            <div class="q-mt-md" align="center">
              <q-btn
                v-if="file"
                @click="request()"
                label="Enviar"
                color="primary"
                class="q-mt-md"
              />
            </div>
          </q-card-section>
        </div>
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
  usuarioId: [String, Number],
  documento: [Object],
})

// EMITS
const emit = defineEmits(['update:modelValue', 'updated'])

// QUASAR
const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// STATE
const file = ref(null)

// LIFECYCLE
function beforeShow() {
  file.value = null
}

// ACTION

function request() {
  const data = new FormData()
  if (file.value) data.append('arquivo', file.value)
  data.append('motorista_id', props.usuarioId)
  data.append('tipo_documento', props.documento.value?.tipo_documento)
  api
    .post('/motorista-documentos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      $q.notify({ type: 'positive', message: res.data.message })
      emit('updated')
      model.value = false
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err.response?.data?.message })
    })
}
</script>
