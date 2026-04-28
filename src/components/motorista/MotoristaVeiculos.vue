<template>
  <section>
    <AdicionarVeiculo
      :usuario="usuario"
      @onRequest="onRequest()"
      v-model="dialog"
      @hide="reabrirPrincipal($event)"
    />
    <q-dialog v-model="model" @before-show="beforeShow" @before-hide="onBeforeHide">
      <q-card>
        <q-toolbar>
          <!-- <q-avatar rounded size="md" icon="directions_car" color="primary" text-color="white" /> -->
          <q-toolbar-title>
            Veículos do motorista
            <!-- <span> Veículos do motorista </span> -->
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator />
        <CardPerfilUsuario class="q-mt-sm" :usuario="usuario" />

        <q-card-section align="center" v-if="!data.length">
          <div style="font-size: 20px" class="text-weight-bold">Nenhum veículo cadastrado</div>

          <q-card class="my-card bg-primary text-white q-mt-md">
            <!-- <q-card-section>
              <div class="text-h6">Nenhum veículo cadastrado</div>
            </q-card-section> -->

            <q-icon size="150px" name="data_array" />
          </q-card>
          <q-card-actions class="q-mt-md" align="center">
            <q-btn color="primary" @click="abrirAdicionarVeiculo()" flat>ADICIONAR VEÍCULO</q-btn>
          </q-card-actions>
        </q-card-section>
        <q-separator />

        <q-card-section v-if="data.length">
          <div class="q-pa-xs">
            <q-table
              :rows="data"
              :columns="columns"
              row-key="id"
              :pagination="pagination"
              :loading="loading"
              @request="onRequest"
            >
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
                    <q-btn
                      icon="add_box"
                      label="ADICIONAR VEÍCULO"
                      color="primary"
                      @click="abrirAdicionarVeiculo()"
                    />
                  </template>

                  <template v-if="search" #append>
                    <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
                  </template>
                </q-input>
              </template>

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
                    <q-btn dense flat icon="visibility">
                      <q-tooltip transition-show="flip-right" transition-hide="flip-left">
                        visualizar
                      </q-tooltip>
                      <template v-slot:loading>
                        <q-spinner-hourglass />
                      </template>
                    </q-btn>
                    <q-btn dense flat icon="delete">
                      <template v-slot:loading>
                        <q-spinner-hourglass />
                      </template>
                    </q-btn>
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
import CardPerfilUsuario from 'src/components/usuarios/CardPerfilUsuario.vue'

// import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

// PROPS
const props = defineProps({
  modelValue: Boolean,
  usuario: [Object],
})

// EMITS
const emit = defineEmits(['update:modelValue'])

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
    name: 'id',
    required: true,
    label: '',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
  {
    name: 'veiculo',
    required: true,
    label: 'Documentos',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
  },
  {
    name: 'acoes',
    label: 'Ações',
    align: 'center',
  },
]

// LIFECYCLE
function beforeShow() {
  data.value = []
  request()
}

function onBeforeHide() {
  console.log('passou em onBeforeHide')
  data.value = []
}

function reabrirPrincipal(valor) {
  console.log(valor, 'passou em reabrirPrincipal')
  if (!valor) {
    model.value = true
  }
}

function abrirAdicionarVeiculo() {
  console.log('abrirAdicionarVeiculo')
  model.value = false
  dialog.value = true
}

const badgeColor = (status) => {
  if (status === 'ativo') return 'green'
  if (status === 'inativo') return 'orange'
  if (status === 'pendente') return 'warning'
  if (status === 'bloqueado') return 'red'
}

const onRequest = async (props) => {
  await request(props)
}

const request = async (payload) => {
  if (!props?.usuario?.id) return
  loading.value = true
  const { page, rowsPerPage } = payload ? props.pagination : pagination
  try {
    const response = await api.get(`/motorista-veiculos/${props.usuario?.id}`, {
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
