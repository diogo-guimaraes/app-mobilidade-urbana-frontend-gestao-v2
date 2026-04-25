<template>
  <q-page class="q-pa-md">
    <CriarUsuario @created="onRequest" v-model="dialog.cadastrar" />
    <EditarUsuario @updated="onRequest" v-model="dialog.editar" :usuarioId="usuarioId" />
    <MostrarUsuario v-model="dialog.visualizar" />
    <DocumentosUsuario :usuarioId="usuarioId" v-model="dialog.documentos" />
    <ExcluirUsuario
      :acao="openPress"
      :data="usuarioSelecionado"
      @deleted="onRequest"
      v-model="dialog.excluir"
    />
    <q-card>
      {{ usuarioId }}
      <q-table
        :rows="usuarios.data"
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
              <q-btn-toggle
                @update:model-value="buscarDados()"
                v-model="dominio"
                toggle-color="primary"
                :options="[
                  { label: 'Ativos', value: 'users' },
                  { label: 'Arquivados', value: 'usuarios-arquivados' },
                ]"
              />
              <q-btn icon="person_add_alt" color="primary" @click="dialog.cadastrar = true" />
            </template>

            <template #append>
              <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
            </template>

            <template #after>
              <q-btn round dense flat icon="search" @click="buscarDados" />

              <q-btn flat round dense :icon="grid ? 'list' : 'grid_on'" @click="toggleGrid" />
            </template>
          </q-input>
        </template>

        <!-- LISTA -->
        <template #body="props">
          <q-tr :props="props">
            <q-td key="id">{{ props.row.id }}</q-td>

            <q-td key="nome">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar v-if="props.row.foto_thumbnail">
                    <img :src="props.row.foto" />
                  </q-avatar>
                  <q-avatar v-else color="primary" text-color="white">
                    {{ props.row.name.substr(0, 1) }}
                  </q-avatar>
                  <q-badge class="q-mt-sm" :label="props.row.type" color="grey-7" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-bold"> {{ props.row.name }}</q-item-label>
                  <q-item-label class="estilo-coluna">
                    {{ props.row.email }}
                    <div>CPF: {{ props.row.cpf }}</div>
                    <div>TEL: {{ props.row.telefone }}</div>
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
                @click=";(dialog.documentos = true), (usuarioId = props.row.id)"
                flat
                dense
                icon="list_alt"
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
        <template #item="props">
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
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from 'boot/axios'
import CriarUsuario from 'src/components/usuarios/CriarUsuario.vue'
import MostrarUsuario from 'src/components/usuarios/MostrarUsuario.vue'
import EditarUsuario from 'src/components/usuarios/EditarUsuario.vue'
import ExcluirUsuario from 'src/components/usuarios/ExcluirUsuario.vue'
import DocumentosUsuario from 'src/components/usuarios/DocumentosUsuario.vue'

// STATES
const usuarios = ref({
  success: true,
  data: [],
})

const dominio = ref('users')
const usuarioSelecionado = ref(null)
const openPress = ref(null)
const loading = ref(false)
const search = ref('')
const grid = ref(false)

const dialog = reactive({
  editar: false,
  cadastrar: false,
  visualizar: false,
  excluir: false,
})

const usuarioId = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center' },
]

const badgeColor = (status) => {
  if (status === 'aprovado') return 'green'
  if (status === 'suspenso') return 'orange'
  if (status === 'banido') return 'red'
}

const toggleGrid = () => {
  grid.value = !grid.value
}

const clearSearch = () => {
  search.value = ''
  pagination.value.page = 1
  buscarDados()
}

const openEditar = (id) => {
  usuarioId.value = id
  dialog.editar = true
}

const openExcluir = (usuario) => {
  usuarioSelecionado.value = [usuario]
  openPress.value = 'arquivar'
  dialog.excluir = true
}

const buscarDados = async (props) => {
  console.log(dominio.value, 'dominio value')
  loading.value = true
  const { page, rowsPerPage } = props ? props.pagination : pagination
  try {
    const response = await api.get(`${dominio.value}`, {
      params: {
        search: search.value || '',
        page: page,
        rowsPerPage: rowsPerPage,
      },
    })

    const data = response.data

    usuarios.value = {
      success: true,
      data: data.data, // array de usuários
    }

    pagination.value.rowsNumber = data.total
    pagination.value.page = data.current_page
    pagination.value.rowsPerPage = data.per_page === data.total ? 0 : data.per_page
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
