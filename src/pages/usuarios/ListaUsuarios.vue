<template>
  <q-page class="q-pa-md">
    <div v-if="usuarios.success">
      <CriarUsuario @created="onRequest" v-model="dialog.cadastrar" />
      <q-card>
        <q-table
          :rows="usuarios.data"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
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
                <div class="flex items-center q-gutter-sm">
                  <q-avatar v-if="props.row.image_host_path">
                    <img :src="props.row.image_host_path" />
                  </q-avatar>

                  <q-avatar v-else color="primary" text-color="white">
                    {{ props.row.name?.charAt(0) }}
                  </q-avatar>

                  <div>
                    <div>{{ props.row.name }}</div>
                    <div class="text-caption">
                      {{ props.row.skill }}
                    </div>
                  </div>
                </div>
              </q-td>

              <q-td key="email">
                {{ props.row.email }}
              </q-td>

              <q-td key="categoria_grupo">
                {{ props.row.categoria_grupo?.nome }}
              </q-td>

              <q-td key="acoes" align="center">
                <q-btn flat dense icon="visibility" @click="openEditar(props.row.id)" />
                <q-btn flat dense icon="delete" @click="arquivarUsuario(props.row.id)" />
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
                      <img
                        v-if="props.row.thumbnail_host_path"
                        :src="props.row.thumbnail_host_path"
                      />
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { api } from 'boot/axios'
import CriarUsuario from 'src/components/usuarios/CriarUsuario.vue'

// STATES
const usuarios = ref({
  success: true,
  data: [],
})

const loading = ref(false)
const search = ref('')
const grid = ref(false)

const dialog = reactive({
  editarUsuario: false,
  cadastrar: false,
})

const usuarioId = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 8,
  rowsNumber: 0,
})

// COLUMNS
const columns = [
  { name: 'id', label: 'ID', field: 'id' },
  { name: 'nome', label: 'Nome', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'categoria_grupo', label: 'Grupo', field: 'categoria_grupo' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

// METHODS
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
  dialog.editarUsuario = true
}

const buscarDados = async () => {
  loading.value = true

  try {
    const response = await api.get('/users', {
      params: {
        filtro: 'usuariosRegistro',
        search: search.value || '',
        page: pagination.value.page,
        rowsPerPage: pagination.value.rowsPerPage,
      },
    })

    const data = response.data.data

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
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  await buscarDados()
}

const arquivarUsuario = async (id) => {
  if (!confirm('Deseja arquivar o usuário?')) return

  try {
    await api.delete(`/users/${id}/arquivar`)
    buscarDados()
  } catch (error) {
    console.error(error)
  }
}

// LIFECYCLE
onMounted(() => {
  buscarDados()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
