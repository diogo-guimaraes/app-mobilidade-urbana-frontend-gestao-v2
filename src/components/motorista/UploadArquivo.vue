<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow">
      <q-card style="width: 700px; max-width: 80vw">
        <!-- HEADER -->
        <q-toolbar>
          <q-avatar rounded size="lg" icon="file_present" color="primary" text-color="white" />
          <q-toolbar-title>
            <span class="text-weight-bold">Upload de arquivo</span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator />

        <div class="q-pa-md">
          <q-stepper v-model="step" ref="stepper" color="primary" animated>
            <q-step :name="1" title="Seleção do tipo de documento" icon="settings" :done="step > 1">
              <q-card>
                <q-table
                  flat
                  :rows="data"
                  :columns="columns"
                  row-key="documento"
                  hide-bottom
                  hide-header
                  selection="single"
                  v-model:selected="selected"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td>
                        <q-checkbox v-model="props.selected" />
                      </q-td>
                      <q-td key="name" :props="props">
                        <q-item>
                          <q-item-section top avatar>
                            <q-avatar rounded>
                              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                            </q-avatar>
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-h6"> {{ props.row.documento }}</q-item-label>
                            <q-item-label class="estilo-coluna" caption>
                              {{ props.row.descricao }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-card>
            </q-step>

            <q-step :name="2" title="Selecionar documento" icon="upload_file" :done="step > 2">
              <q-card-section>
                <q-item class="q-pa-none">
                  <q-item-section top avatar>
                    <q-avatar rounded>
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-h6"> {{ selected[0]?.documento }} </q-item-label>
                    <q-item-label class="estilo-coluna" caption>
                      {{ selected[0]?.descricao }}
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
                <q-btn
                  v-if="file"
                  @click="request()"
                  label="Enviar"
                  color="primary"
                  class="full-width q-mt-md"
                />
              </q-card-section>
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn
                  @click="$refs.stepper.next()"
                  color="primary"
                  label="Continue"
                  v-if="step === 1"
                  :disable="selected.length ? false : true"
                />
                <q-btn
                  v-if="step > 1"
                  flat
                  color="primary"
                  @click="$refs.stepper.previous(), (file = null)"
                  label="VOLTAR"
                  class="q-ml-sm"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
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
})

// EMITS
const emit = defineEmits(['update:modelValue', 'onRequest'])

// QUASAR
const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// STATE
const file = ref(null)
const step = ref(1)
const selected = ref([])
const data = ref([
  {
    documento: 'CNH',
    descricao: 'CARTEIRA NACIONAL DE HABILITAÇÃO',
  },

  {
    documento: 'SEGURO',
    descricao: 'SEGURO OBRIGATÓRIO',
  },
  {
    documento: 'VEÍCULO - CRLV',
    descricao: 'CERTIFICADO DE REGISTRO E LICENCIAMENTE DO VEÍCULO',
  },
])

const columns = [
  {
    name: 'name',
    label: 'Documento',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
]
// COMPUTED

// LIFECYCLE
function beforeShow() {
  file.value = null
  step.value = 1
}

// ACTION

function request() {
  const data = new FormData()
  if (file.value) data.append('arquivo', file.value)
  data.append('motorista_id', props.usuarioId)
  data.append('documento', selected.value[0]?.documento)
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
