<template>
  <q-page class="q-pa-md">
    <CriarVeiculo @onRequest="onRequest" v-model="dialog.criar" />
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
            <template v-if="search" #append>
              <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
            </template>
          </q-input>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td key="id">{{ props.row.id }}</q-td>

            <q-td key="corrida">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="text-bold">Motorista:</span>
                    {{ props.row.motorista.user.name }}</q-item-label
                  >
                  <q-item-label>
                    <span class="text-bold"> Passageiro: </span>
                    {{ props.row.passageiro.user.name }}
                  </q-item-label>
                  <q-item-label>
                    <span class="text-bold"> Veículo: </span>
                    {{ props.row.veiculo.placa }}
                  </q-item-label>
                  <div>
                    <span class="text-bold"> Status: </span>
                    <q-badge :color="badgeColor(props.row.status)">
                      {{ props.row.status }}
                    </q-badge>
                  </div>
                </q-item-section>
              </q-item>
            </q-td>

            <q-td class="coluna-delimitada" :props="props" key="destinos">
              <div v-for="(corrida, index) in props.row.corrida_destinos" :key="index">
                <q-icon
                  :color="corInconeDestino(corrida.tipo)"
                  size="20px"
                  :name="iconesDestino(corrida.tipo)"
                />
                {{ limitarTexto(corrida.endereco, 20) }}
              </div>
            </q-td>

            <q-td :props="props" key="valores">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <span class="text-bold"> Valor burto: </span>
                    {{ moedaBrasileira(props.row.corrida_financeiro.valor_bruto) }}</q-item-label
                  >
                  <q-item-label>
                    <span class="text-bold"> Tarifa base: </span>
                    {{ moedaBrasileira(props.row.corrida_financeiro.tarifa_base) }}
                  </q-item-label>

                  <q-item-label>
                    <span class="text-bold"> Taxa espera: </span>
                    {{ moedaBrasileira(props.row.corrida_financeiro.taxa_espera) }}
                  </q-item-label>

                  <q-item-label>
                    <span class="text-bold"> Valor paga: </span>
                    {{ moedaBrasileira(props.row.corrida_financeiro.valor_pago_passageiro) }}
                  </q-item-label>

                  <q-item-label>
                    <span class="text-bold"> Desconto passageiro: </span>
                    {{
                      moedaBrasileira(props.row.corrida_financeiro.corrida_desconto.valor_desconto)
                    }}
                  </q-item-label>

                  <q-item-label>
                    <span class="text-bold">Taxa plataforma</span>
                    {{ moedaBrasileira(props.row.corrida_financeiro.valor_plataforma) }}
                  </q-item-label>

                  <q-item-label>
                    <span class="text-bold"> Valor motorista</span>
                    {{ moedaBrasileira(props.row.corrida_financeiro.valor_motorista) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-td>

            <q-td key="acoes" align="center">
              <q-btn @click="openEditar(props.row.id)" dense flat icon="visibility">
                <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                  visualizar
                </q-tooltip>
                <template v-slot:loading>
                  <q-spinner-hourglass />
                </template>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
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
  { name: 'corrida', label: 'Corrida', align: 'left' },
  { name: 'destinos', label: 'Destinos', align: 'left' },
  { name: 'valores', label: 'Valores', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

function moedaBrasileira(value) {
  if (value === null || value === undefined) return ''

  let valor = Number(value)

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const badgeColor = (status) => {
  if (status === 'solicitada') return 'orange'
  if (status === 'aceita') return 'primary'
  if (status === 'em_andamento') return 'secondary'
  if (status === 'finalizada') return 'green'
  if (status === 'cancelada') return 'red'
}

const iconesDestino = (tipo) => {
  console.log(tipo, 'tipo')
  if (tipo === 'origem') return 'arrow_circle_up'
  if (tipo === 'parada') return 'stop_circle'
  if (tipo === 'destino') return 'arrow_circle_down'
}

const corInconeDestino = (tipo) => {
  if (tipo === 'origem') return 'green'
  if (tipo === 'destino') return 'red'
}

function limitarTexto(texto, limite) {
  if (!texto) return ''
  return texto.length > limite ? texto.slice(0, limite) + '...' : texto
}

const clearSearch = () => {
  search.value = ''
  pagination.value.page = 1
  buscarDados()
}

const openEditar = (id) => {
  veiculoId.value = id
  dialog.editar = true
}

const buscarDados = async (props) => {
  loading.value = true
  const { page, rowsPerPage } = props ? props.pagination : pagination
  try {
    const response = await api.get('/corridas', {
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
.coluna-delimitada {
  max-width: 200px;
  white-space: normal;
  margin-top: 4px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
