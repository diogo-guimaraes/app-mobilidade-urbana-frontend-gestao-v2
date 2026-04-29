<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow" @before-hide="onBeforeHide">
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" title="Documentos" icon="settings" :done="step > 1">
            <!-- <pre>
              {{ data }}
            </pre> -->
            <!-- <q-card style="border-style: none"> -->
            <CardPerfilUsuario :bordered="true" :usuario="props.usuario" />
            <!-- </q-card> -->

            <q-table
              v-if="step === 1"
              class="q-mt-sm"
              bordered
              flat
              :rows="data"
              :columns="columns"
              row-key="tipo_documento"
              hide-bottom
              hide-header
            >
              <template v-slot:body="props">
                <q-tr @click="selectRow(props.row)" class="cursor-pointer" :props="props">
                  <q-td key="documento" :props="props">
                    <q-item>
                      <q-item-section top avatar>
                        <q-avatar icon="attach_file" size="xl" rounded> </q-avatar>
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
                    <q-icon
                      color="grey"
                      size="sm"
                      :name="props.row.id ? 'arrow_forward_ios' : 'upload'"
                    >
                      <q-tooltip
                        v-if="!props.row.id"
                        transition-show="flip-right"
                        transition-hide="flip-left"
                      >
                        enviar arquivo
                      </q-tooltip>
                    </q-icon>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-step>

          <q-step :name="2" title="" icon="info" :done="step > 2">
            <q-icon
              @click="$refs.stepper.previous()"
              size="30px"
              name="arrow_back"
              color="primary"
              class="cursor-pointer"
            />
            <q-item class="q-mt-md">
              <q-item-section top avatar>
                <q-avatar icon="attach_file" size="xl" rounded> </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-h6"> {{ documentoSelecionado?.titulo }}</q-item-label>
                <q-item-label class="estilo-coluna" caption>
                  {{ documentoSelecionado?.descricao }}
                </q-item-label>
              </q-item-section>
              <q-item-label caption>
                <q-badge
                  :color="badgeColor(documentoSelecionado?.status)"
                  :label="
                    documentoSelecionado?.status ? documentoSelecionado?.status : 'Não enviado'
                  "
                />

                <q-btn
                  v-if="documentoSelecionado?.status"
                  class="q-ml-lg"
                  @click.stop.prevent
                  title="Menu"
                  icon="linear_scale"
                  dense
                  flat
                  round
                >
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup>
                        <q-item-section>Ver detalhes</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section> reprovar documento </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>excluir</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-label>
            </q-item>

            <div align="center" class="q-mt-md" v-if="documentoSelecionado?.status">
              <div v-if="documentoSelecionado?.status === 'em_analise'" class="q-pa-md q-gutter-sm">
                <div v-if="reprovar">
                  <q-input
                    dense
                    outlined
                    autogrow
                    class="full-width q-px-md q-mb-md"
                    v-model="documentoSelecionado.observacao"
                    type="textarea"
                    bottom-slots
                    counter
                    maxlength="2000"
                  >
                    <template v-slot:after>
                      <q-btn
                        @click="reprovar = true"
                        style="width: 100px"
                        dense
                        color="red"
                        label="REPROVAR"
                      />
                    </template>

                    <template v-slot:hint> Caracteres </template>
                  </q-input>
                </div>

                <div v-else>
                  <q-btn
                    @click="reprovar = true"
                    style="width: 100px"
                    dense
                    color="red"
                    label="REPROVAR"
                  />
                  <q-btn
                    style="width: 100px"
                    dense
                    @click="
                      () => {
                        documentoId = documentoSelecionado?.id
                        dialog.confirmacao = true
                      }
                    "
                    color="green"
                    label="APROVAR"
                  />
                </div>
                <!-- <q-btn color="amber" glossy label="Amber" /> -->
              </div>
            </div>

            <div v-else class="q-mt-md" align="center">
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
              Documentos do motorista
            </q-banner>
          </template>
        </q-stepper>
      </q-card>
    </q-dialog>
    <JanelaConfirmacao v-model="dialog.confirmacao" @confirm="mudarStatusDocumento('aprovado')">
      Deseja realmente aprovar o ducmento?
    </JanelaConfirmacao>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import CardPerfilUsuario from 'src/components/usuarios/CardPerfilUsuario.vue'
import JanelaConfirmacao from 'src/components/JanelaConfirmacao.vue'

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
const reprovar = ref(false)
const file = ref(null)
const step = ref(1)
const stepper = ref(null)
const documentoId = ref('')
const documentoSelecionado = ref({})
const motoristaDocumentos = ref([])
const dialog = ref({
  confirmacao: false,
})

const data = ref([
  {
    id: '',
    titulo: 'CNH',
    tipo_documento: 'cnh',
    descricao: 'CARTEIRA NACIONAL DE HABILITAÇÃO',
    status: '',
    observacao: '',
  },
  {
    id: '',
    titulo: 'VEÍCULO - CRLV',
    tipo_documento: 'crlv',
    descricao: 'CERTIFICADO DE REGISTRO E LICENCIAMENTE DO VEÍCULO',
    status: '',
    observacao: '',
  },
  {
    id: '',
    titulo: 'NADA CONSTA',
    tipo_documento: 'nada_consta',
    descricao: 'CERTIDÃO NEGATIVA DE ANTECEDENTES CRIMINAIS',
    status: '',
    observacao: '',
  },
  {
    id: '',
    titulo: 'SEGURO',
    tipo_documento: 'seguro_obrigatorio',
    descricao: 'SEGURO OBRIGATÓRIO',
    status: '',
    observacao: '',
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

function dataInicial() {
  data.value = [
    {
      id: '',
      titulo: 'CNH',
      tipo_documento: 'cnh',
      descricao: 'CARTEIRA NACIONAL DE HABILITAÇÃO',
      status: '',
    },
    {
      id: '',
      titulo: 'VEÍCULO - CRLV',
      tipo_documento: 'crlv',
      descricao: 'CERTIFICADO DE REGISTRO E LICENCIAMENTE DO VEÍCULO',
      status: '',
    },
    {
      id: '',
      titulo: 'NADA CONSTA',
      tipo_documento: 'nada_consta',
      descricao: 'CERTIDÃO NEGATIVA DE ANTECEDENTES CRIMINAIS',
      status: '',
    },
    {
      id: '',
      titulo: 'SEGURO',
      tipo_documento: 'seguro_obrigatorio',
      descricao: 'SEGURO OBRIGATÓRIO',
      status: '',
    },
  ]
}

function beforeShow() {
  dataInicial()
  getMotoristaDocumentos()
}

function onBeforeHide() {
  dataInicial()
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

function subirArquivo() {
  const data = new FormData()
  if (file.value) data.append('arquivo', file.value)
  data.append('motorista_id', props.usuario?.id)
  data.append('tipo_documento', documentoSelecionado.value?.tipo_documento)
  api
    .post('/motorista-documentos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      $q.notify({ type: 'positive', position: 'top-right', message: res.data.message })
      step.value = 1
      documentoSelecionado.value = {}
      getMotoristaDocumentos()
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err.response?.data?.message })
    })
}

async function mudarStatusDocumento(status) {
  try {
    const response = await api.put(`mudar-status-documento/${documentoId.value}`, {
      status: status,
    })
    console.log(response, 'response')
    step.value = 1
    documentoSelecionado.value = {}
    getMotoristaDocumentos()
    $q.notify({ type: 'positive', message: response.data.message })
  } catch (err) {
    console.log(err, 'err')
    // model.value = false
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    // model.value = false
  }
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
    console.log(data.value, 'data')
    console.log(motoristaDocumentos, 'motoristaDocumentos motoristaDocumentos')

    // 🔥 cria um map para busca rápida por documento
    const documentosMap = new Map(
      motoristaDocumentos.value.map((item) => [item.tipo_documento, item])
    )

    // 🔥 faz o merge mantendo estrutura original do data
    data.value = data.value.map((item) => {
      const doc = documentosMap.get(item.tipo_documento)

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
