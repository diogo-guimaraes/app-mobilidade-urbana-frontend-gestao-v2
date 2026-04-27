<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow" @before-hide="onBeforeHide">
      <AdicionarVeiculo :usuarioId="usuarioId" @onRequest="onRequest()" v-model="dialog" />
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-toolbar>
          <q-avatar rounded size="md" icon="directions_car" color="primary" text-color="white" />
          <q-toolbar-title>
            <span class="text-weight-bold"> Veículos do motorista </span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator />
        <!-- <pre>
          {{ data }}
        </pre> -->
        <q-card-section>
          <div class="q-pa-xs">
            <q-table
              :rows="data"
              :columns="columns"
              row-key="id"
              :pagination="pagination"
              :loading="loading"
              @request="onRequest"
            >
              <!-- TOPO -->
              <template #top>
                <q-space />

                <q-input
                  class="full-width"
                  filled
                  dense
                  debounce="300"
                  v-model="search"
                  placeholder="Pesquisar"
                  @keyup.enter="onRequest()"
                >
                  <template #before>
                    <!-- <q-btn-toggle
                @update:model-value="
                  (val) => {
                    dominio = val
                    onRequest()()
                  }
                "
                v-model="dominio"
                toggle-color="primary"
                :options="[
                  { label: 'Ativos', value: 'users' },
                  { label: 'Arquivados', value: 'usuarios-arquivados' },
                ]"
              />
               -->
                    <q-btn
                      icon="add_box"
                      label="ADICIONAR VEÍCULO"
                      color="primary"
                      @click="dialog = true"
                    />
                  </template>

                  <template v-if="search" #append>
                    <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
                  </template>

                  <!-- <template #after>
              <q-btn round dense flat icon="search" @click="onRequest()" />

              <q-btn flat round dense :icon="grid ? 'list' : 'grid_on'" @click="toggleGrid" />
            </template> -->
                </q-input>
              </template>

              <!-- LISTA -->
              <template #body="props">
                <q-tr :props="props">
                  <q-td key="id">{{ props.row.id }}</q-td>

                  <q-td key="veiculo">
                    <q-item>
                      <q-item-section top avatar>
                        <q-avatar rounded color="primary" text-color="white" icon="directions_car">
                        </q-avatar>
                        <q-badge class="q-mt-sm" :label="props.row.veiculo.marca" color="grey-7" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-bold">
                          {{ props.row.veiculo.modelo }}</q-item-label
                        >
                        <q-item-label class="estilo-coluna">
                          {{ props.row.veiculo.renavam }}
                          <div>PLACA: {{ props.row.veiculo.placa }}</div>
                          <div>COR: {{ props.row.veiculo.cor }}</div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-td>

                  <q-td key="status">
                    <q-badge :color="badgeColor(props.row.veiculo.status)">
                      {{ props.row.veiculo.status }}
                    </q-badge>
                  </q-td>

                  <q-td key="acoes" align="center">
                    <q-btn @click="openEditar(props.row.id)" dense flat icon="visibility">
                      <template v-slot:loading>
                        <q-spinner-hourglass />
                      </template>
                    </q-btn>

                    <!-- <q-btn
                      @click=";(dialog.documentos = true), (veiculoId = props.row.id)"
                      flat
                      dense
                      icon="groups_2"
                    >
                      <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                        Documentos
                      </q-tooltip>
                    </q-btn> -->
                    <q-btn dense flat icon="directions_car">
                      <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                        Veículos
                      </q-tooltip>
                    </q-btn>

                    <!-- <q-btn @click="openExcluir(props.row)" dense flat icon="delete">
                      <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                        arquivar
                      </q-tooltip>
                    </q-btn> -->
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import AdicionarVeiculo from 'src/components/motorista/AdicionarVeiculo.vue'
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
const loading = ref(false)
const search = ref('')
const dialog = ref(false)
const data = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
})

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Documentos',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
  {
    name: 'acoes',
    label: 'Ações',
  },
]

// COMPUTED

// LIFECYCLE
function beforeShow() {
  data.value = []
  request()
}

function onBeforeHide() {
  data.value = []
}

// ACTION

const badgeColor = (status) => {
  if (status === 'ativo') return 'green'
  if (status === 'inativo') return 'orange'
  if (status === 'pendente') return 'warning'
  if (status === 'bloqueado') return 'red'
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
    const response = await api.get(`/motorista-veiculos/${props.usuarioId}`, {
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
