<template>
  <q-page class="q-pa-md">
    <CriarVeiculo @created="onRequest" v-model="dialog.criar" />
    <EditarVeiculo @updated="onRequest" v-model="dialog.editar" :veiculoId="veiculoId" />
    <MostrarVeiculo v-model="dialog.mostrar" />
    <ExcluirVeiculo
      :acao="openPress"
      :data="usuarioSelecionado"
      @deleted="onRequest"
      v-model="dialog.excluir"
    />
    <q-card>
      <q-table
        :rows="data"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :grid="grid"
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
            @keyup.enter="buscarDados"
          >
            <template #before>
              <!-- <q-btn-toggle
                @update:model-value="
                  (val) => {
                    dominio = val
                    buscarDados()
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
                @click="dialog.criar = true"
              />
            </template>

            <template v-if="search" #append>
              <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
            </template>

            <!-- <template #after>
              <q-btn round dense flat icon="search" @click="buscarDados" />

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
                  <q-badge class="q-mt-sm" :label="props.row.marca" color="grey-7" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-bold"> {{ props.row.modelo }}</q-item-label>
                  <q-item-label class="estilo-coluna">
                    {{ props.row.renavam }}
                    <div>PLACA: {{ props.row.placa }}</div>
                    <div>COR: {{ props.row.cor }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-td>

            <q-td key="status">
              <q-badge :color="badgeColor(props.row.status)">
                {{ props.row.status }}
              </q-badge>
            </q-td>

            <q-td key="acoes" align="center">
              <q-btn @click="openEditar(props.row.id)" dense flat icon="visibility">
                <template v-slot:loading>
                  <q-spinner-hourglass />
                </template>
              </q-btn>

              <q-btn
                @click=";(dialog.documentos = true), (veiculoId = props.row.id)"
                flat
                dense
                icon="groups_2"
              >
                <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                  Documentos
                </q-tooltip>
              </q-btn>
              <q-btn dense flat icon="directions_car">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                  Veículos
                </q-tooltip>
              </q-btn>

              <q-btn @click="openExcluir(props.row)" dense flat icon="delete">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                  arquivar
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>

        <!-- GRID -->
        <!-- <template #item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3">
            <q-card>
              <q-item clickable @click="openEditar(props.row.id)">
                <q-item-section avatar>
                  <q-avatar size="70px">
                    <img v-if="props.row.foto" :src="props.row.foto" />
                    <span v-else>
                      {{ props.row.name?.charAt(0) }}
                    </span>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ props.row.name }}</q-item-label>
                  <q-item-label caption>
                    {{ props.row.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </template> -->
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from 'boot/axios'
import CriarVeiculo from 'src/components/veiculos/CriarVeiculo.vue'
import MostrarVeiculo from 'src/components/veiculos/MostrarVeiculo.vue'
import EditarVeiculo from 'src/components/veiculos/EditarVeiculo.vue'
import ExcluirVeiculo from 'src/components/veiculos/ExcluirVeiculo.vue'

// STATES
const data = ref([])

// const dominio = ref('users')
const usuarioSelecionado = ref(null)
const openPress = ref(null)
const loading = ref(false)
const search = ref('')
const grid = ref(false)

const dialog = reactive({
  editar: false,
  criar: false,
  mostrar: false,
  excluir: false,
})

const veiculoId = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'veiculo', label: 'Veículo', align: 'left' },
  // { name: 'modelo', label: 'modelo', field: 'status', align: 'left' },
  // { name: 'ano_fabricacao', label: 'ano_fabricacao', align: 'center' },
  // { name: 'ano_modelo', label: 'ano_modelo', field: 'status', align: 'left' },
  // { name: 'cor', label: 'cor', field: 'status', align: 'left' },
  // { name: 'placa', label: 'placa', field: 'status', align: 'left' },
  // { name: 'renavam', label: 'renavam', field: 'status', align: 'left' },
  // { name: 'categoria', label: 'categoria', field: 'status', align: 'left' },
  { name: 'status', label: 'status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const badgeColor = (status) => {
  if (status === 'ativo') return 'green'
  if (status === 'inativo') return 'orange'
  if (status === 'pendente') return 'warning'
  if (status === 'bloqueado') return 'red'
}

// const toggleGrid = () => {
//   grid.value = !grid.value
// }

const clearSearch = () => {
  search.value = ''
  pagination.value.page = 1
  buscarDados()
}

const openEditar = (id) => {
  veiculoId.value = id
  dialog.editar = true
}

const openExcluir = (usuario) => {
  usuarioSelecionado.value = [usuario]
  openPress.value = 'arquivar'
  dialog.excluir = true
}

const buscarDados = async (props) => {
  loading.value = true
  const { page, rowsPerPage } = props ? props.pagination : pagination
  try {
    const response = await api.get('/veiculos', {
      params: {
        search: search.value || '',
        page: page,
        rowsPerPage: rowsPerPage,
      },
    })

    const paginate = response.data

    data.value = response.data.data
    pagination.value.rowsNumber = paginate.total
    pagination.value.page = paginate.current_page
    pagination.value.rowsPerPage = paginate.per_page === paginate.total ? 0 : paginate.per_page
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
const onRequest = async (props) => {
  console.log(props, 'props')
  await buscarDados(props)
}

// LIFECYCLE
onMounted(() => {
  buscarDados()
})
</script>

<style scoped>
.estilo-coluna {
  max-width: 200px;
  white-space: normal;
  margin-top: 4px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
