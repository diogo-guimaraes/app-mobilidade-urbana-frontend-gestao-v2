<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow" @before-hide="onBeforeHide">
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" title="Selecione o tipo de documento" icon="settings" :done="step > 1">
            <!-- <pre>
              {{ data }}
            </pre> -->
            <CardPerfilUsuario :usuario="props.usuario" />

            <q-table
              v-if="step === 1"
              class="q-mt-sm"
              bordered
              flat
              :rows="data"
              :columns="columns"
              row-key="documento"
              hide-bottom
              hide-header
            >
              <template v-slot:body="props">
                <q-tr @click="selectRow(props.row)" class="cursor-pointer" :props="props">
                  <q-td key="documento" :props="props">
                    <q-item>
                      <q-item-section top avatar>
                        <q-avatar icon="attach_file" size="xl" rounded>
                          <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png" /> -->
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-h6"> {{ props.row.titulo }}</q-item-label>
                        <q-item-label class="estilo-coluna" caption>
                          {{ props.row.descricao }}
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-item-label caption>situação</q-item-label>
                        <q-item-label caption>
                          <q-badge
                            :color="badgeColor(props.row.status)"
                            :label="props.row.status ? props.row.status : 'Não enviado'"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-td>
                  <q-td key="acoes">
                    <q-icon color="grey" size="sm" name="arrow_forward_ios" />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-step>

          <q-step :name="2" title="Envie o ducmento" icon="upload_file" :done="step > 2">
            <q-icon
              @click="$refs.stepper.previous()"
              size="30px"
              name="arrow_back"
              color="primary"
              class="cursor-pointer"
            />
            <q-item>
              <q-item-section top avatar>
                <q-avatar icon="attach_file" size="xl" rounded> </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-h6"> {{ documentoSelecionado?.titulo }}</q-item-label>
                <q-item-label class="estilo-coluna" caption>
                  {{ documentoSelecionado?.descricao }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <div class="q-mt-md" align="center">
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
                @click="subirArquivo()"
                label="Enviar"
                color="primary"
                class="q-mt-md"
              />
            </div>
          </q-step>

          <template v-slot:message>
            <q-banner v-if="step === 1 || step === 2" class="bg-primary text-white q-px-lg">
              Enviar documentos
            </q-banner>
          </template>
        </q-stepper>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import CardPerfilUsuario from 'src/components/usuarios/CardPerfilUsuario.vue'

// PROPS
const props = defineProps({
  modelValue: Boolean,
  usuario: [Object],
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
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})
const file = ref(null)
const step = ref(1)
const stepper = ref(null)
const documentoSelecionado = ref({})
const motoristaDocumentos = ref([])

const data = ref([
  {
    id: '',
    titulo: 'CNH',
    documento: 'cnh',
    descricao: 'CARTEIRA NACIONAL DE HABILITAÇÃO',
    status: '',
  },
  {
    id: '',
    titulo: 'VEÍCULO - CRLV',
    documento: 'crlv',
    descricao: 'CERTIFICADO DE REGISTRO E LICENCIAMENTE DO VEÍCULO',
    status: '',
  },
  {
    id: '',
    titulo: 'NADA CONSTA',
    documento: 'nada_consta',
    descricao: 'CERTIDÃO NEGATIVA DE ANTECEDENTES CRIMINAIS',
    status: '',
  },
  {
    id: '',
    titulo: 'SEGURO',
    documento: 'seguro_obrigatorio',
    descricao: 'SEGURO OBRIGATÓRIO',
    status: '',
  },
])

const columns = [
  {
    name: 'documento',
    label: 'Documentos',
    align: 'left',
  },
  {
    name: 'acoes',
    label: 'Ações',
  },
]

function beforeShow() {
  // data.value = []
  getMotoristaDocumentos()
}

function onBeforeHide() {
  data.value = []
}

// ACTION

function selectRow(row) {
  documentoSelecionado.value = row
  stepper.value.next()
}

const badgeColor = (status) => {
  if (status === 'aprovado') return 'green'
  if (status === 'reprovado') return 'red'
  if (status === 'em_analise') return 'orange'
  return 'grey'
}

// const onRequest = async (props) => {
//   console.log(props, 'props')
//   await request(props)
// }

function subirArquivo() {
  const data = new FormData()
  if (file.value) data.append('arquivo', file.value)
  data.append('motorista_id', props.usuario?.id)
  data.append('documento', documentoSelecionado.value?.documento)
  api
    .post('/motorista-documentos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      $q.notify({ type: 'positive', position: 'top-right', message: res.data.message })
      // emit('onRequest')
      step.value = 1
      documentoSelecionado.value = {}
      getMotoristaDocumentos()
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err.response?.data?.message })
    })
}

const getMotoristaDocumentos = async (payload) => {
  if (!props?.usuario?.id) return

  const { page, rowsPerPage } = payload ? props.pagination : pagination

  try {
    const response = await api.get(`/motorista-documentos/${props.usuario?.id}`, {
      params: {
        page: page,
        rowsPerPage: rowsPerPage,
      },
    })

    motoristaDocumentos.value = response.data.data

    console.log(motoristaDocumentos, 'motoristaDocumentos motoristaDocumentos')

    // 🔥 cria um map para busca rápida por documento
    const documentosMap = new Map(motoristaDocumentos.value.map((item) => [item.documento, item]))

    // 🔥 faz o merge mantendo estrutura original do data
    data.value = data.value.map((item) => {
      const doc = documentosMap.get(item.documento)

      if (doc) {
        return {
          ...item,
          id: doc.id,
          status: doc.status,
        }
      }

      return item
    })

    const paginate = response.data
    pagination.value.rowsNumber = paginate.total
    pagination.value.page = paginate.current_page
    pagination.value.rowsPerPage = paginate.per_page === paginate.total ? 0 : paginate.per_page
  } catch (error) {
    console.error(error)
  }
}
</script>
<style scoped>
.estilo-coluna {
  max-width: 200px;
  white-space: normal;
  margin-top: 4px;
}
</style>
