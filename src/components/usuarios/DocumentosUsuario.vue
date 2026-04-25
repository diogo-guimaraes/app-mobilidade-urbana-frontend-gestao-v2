<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow">
      <UploadArquivo @onRequest="onRequest()" v-model="dialog" />
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-toolbar>
          <q-avatar rounded size="md" icon="list_alt" color="primary" text-color="white" />
          <q-toolbar-title>
            <span class="text-weight-bold"> Documentos do motorista </span>
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
              :loading="loading"
              flat
              bordered
              :rows="data"
              :columns="columns"
              row-key="id"
              :pagination="pagination"
              @request="onRequest"
            >
              <template v-slot:top>
                <q-input filled dense v-model="search" placeholder="Pesquisar" class="full-width">
                  <template v-slot:before>
                    <q-btn @click="dialog = true" dense color="primary" icon="upload_file">
                      <q-tooltip
                        transition-show="rotate"
                        transition-hide="rotate"
                        content-class="bg-grey "
                      >
                        subir arquivo
                      </q-tooltip>
                    </q-btn>
                  </template>
                  <template v-slot:append>
                    <q-icon v-if="search" name="close" class="cursor-pointer" />
                  </template>
                </q-input>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props" @click="onRowClick(props.row)">
                  <q-td key="name" :props="props">
                    <q-item>
                      <q-item-section top avatar>
                        <q-avatar icon="list_alt" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label class="text-bold"> {{ props.row.name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-td>

                  <q-td key="acoes" :props="props">
                    <q-btn class="q-ml-sm" icon="download" size="sm" flat dense>
                      <q-tooltip
                        transition-show="rotate"
                        transition-hide="rotate"
                        content-class="bg-grey "
                      >
                        download
                      </q-tooltip>
                    </q-btn>

                    <q-btn class="q-ml-sm" icon="delete" size="sm" flat dense>
                      <q-tooltip
                        transition-show="rotate"
                        transition-hide="rotate"
                        content-class="bg-grey "
                      >
                        arquivar
                      </q-tooltip>
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
import UploadArquivo from 'src/components/usuarios/UploadArquivo.vue'
// import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

// PROPS
const props = defineProps({
  modelValue: Boolean,
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
    label: 'Documento',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'acoes',
    label: 'Ações',
  },
]

// COMPUTED

// LIFECYCLE
function beforeShow() {
  request()
}

// ACTION

const onRequest = async (props) => {
  console.log(props, 'props')
  await request(props)
}

const request = async (props) => {
  loading.value = true
  const { page, rowsPerPage } = props ? props.pagination : pagination
  try {
    const response = await api.get('/motorista-documentos', {
      params: {
        search: search.value || '',
        page: page,
        rowsPerPage: rowsPerPage,
      },
    })

    data.value = response.data.data
    const paginate = response.data
    console.log(data, 'data')
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
