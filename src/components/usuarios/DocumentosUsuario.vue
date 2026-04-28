<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow" @before-hide="onBeforeHide">
      <UploadArquivo :usuarioId="usuarioId" @onRequest="onRequest()" v-model="dialog" />
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" title="Selecione o documento" icon="settings" :done="step > 1">
            <!-- <q-toolbar>
              <q-avatar size="xl" icon="list_alt" />
              <q-toolbar-title>
                <span class="text-weight-bold"> Documentos do motorista </span>
              </q-toolbar-title>

              <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-separator /> -->
            <!-- <pre>
          {{ data }}
        </pre> -->
            <q-table
              bordered
              flat
              :rows="data"
              :columns="columns"
              row-key="documento"
              hide-bottom
              hide-header
            >
              <template v-slot:body="props">
                <q-tr @click="selectRow(props.row)" :props="props">
                  <q-td key="documento" :props="props">
                    <q-item>
                      <q-item-section top avatar>
                        <q-avatar icon="attach_file" size="xl" rounded>
                          <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png" /> -->
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
            <!-- <q-card-section>
              <CardPerfilUsuario :usuario="usuario" />
              <div class="row">
                <div class="col-md-6 col-12">
                  <q-item>
                    <q-input
                      class="full-width"
                      v-model="usuario.cnh_numero"
                      label="Número CNH *"
                      outlined
                      dense
                      :rules="[(val) => val.length >= 11 || 'Campo obrigatório']"
                      onkeypress="return /[0-9]/i.test(event.key)"
                      maxlength="11"
                    />
                  </q-item>
                </div>
                <div class="col-md-6 col-12">
                  <q-item>
                    <q-select
                      v-model="usuario.cnh_categoria"
                      dense
                      outlined
                      class="full-width"
                      label="Categoira CNH *"
                      :options="CnhCategorias"
                      map-options
                      :rules="[(val) => !!val || 'Campo obrigatório']"
                    />
                  </q-item>
                </div>
                <div class="col-md-6 col-12">
                  <q-item>
                    <q-input
                      class="full-width"
                      label="Expiração CNH"
                      dense
                      mask="##/##/####"
                      outlined
                      v-model="usuario.cnh_expiracao"
                      :rules="[(data_inicial) => validateDateFormat(data_inicial)]"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="usuario.cnh_expiracao"
                              mask="DD/MM/YYYY"
                              @input="() => inputData()"
                            ></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item>
                </div>

                <div class="col-md-6 col-12">
                  <q-checkbox
                    size="md"
                    :true-value="1"
                    :false-value="0"
                    v-model="usuario.ear"
                    label="POSSIU EAR"
                  />
                </div>
              </div>
              <div align="center">
                <q-btn
                  icon-right="done"
                  label="CRIAR MOTORISTA"
                  color="primary"
                  class="full-width q-mt-md"
                  @click="criarMotorista()"
                />
              </div>
            </q-card-section> -->
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
import UploadArquivo from 'src/components/motorista/UploadArquivo.vue'
// import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

// PROPS
const props = defineProps({
  modelValue: Boolean,
  usuarioId: [String, Number],
})

// EMITS
const emit = defineEmits(['update:modelValue'])

// QUASAR
// const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// STATE
const step = ref(1)
const loading = ref(false)
const search = ref('')
const dialog = ref(false)
// const data = ref([])
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
  {
    documento: 'NADA CONSTA',
    descricao: 'CERTIDÃO NEGATIVA DE ANTECEDENTES CRIMINAIS',
  },
])

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
})

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

// COMPUTED

// LIFECYCLE
function beforeShow() {
  // data.value = []
  // request()
}

function onBeforeHide() {
  data.value = []
}

// ACTION

function selectRow() {
  // usuario.value = {
  //   cnh_numero: usuario.value.cnh_numero ?? '',
  //   cnh_categoria: usuario.value.cnh_categoria ?? '',
  //   cnh_expiracao: usuario.value.cnh_expiracao ?? '',
  //   ear: usuario.value.ear ?? 0,
  //   ...row,
  // }
  // stepper.value.next()
}

const onRequest = async (props) => {
  console.log(props, 'props')
  await request(props)
}

const request = async (payload) => {
  console.log(props)
  if (!props?.usuarioId) return
  loading.value = true
  const { page, rowsPerPage } = payload ? props.pagination : pagination
  try {
    const response = await api.get(`/motorista-documentos/${props.usuarioId}`, {
      params: {
        search: search.value || '',
        page: page,
        rowsPerPage: rowsPerPage,
      },
    })

    data.value = response.data.data
    const paginate = response.data
    pagination.value.rowsNumber = paginate.total
    pagination.value.page = paginate.current_page
    pagination.value.rowsPerPage = paginate.per_page === paginate.total ? 0 : paginate.per_page
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
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
