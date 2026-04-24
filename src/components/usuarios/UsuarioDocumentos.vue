<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow">
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-toolbar>
          <q-avatar rounded size="md" icon="list_alt" color="primary" text-color="white" />
          <q-toolbar-title>
            <span class="text-weight-bold"> Documentos do usuário </span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator />

        <q-card-section>
          <div class="q-pa-xs">
            <q-table flat bordered :rows="rows" :columns="columns" row-key="name">
              <template v-slot:top>
                <q-input filled dense v-model="search" placeholder="Pesquisar" class="full-width">
                  <template v-slot:before>
                    <q-btn dense color="primary" icon="upload_file">
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
// import { useQuasar } from 'quasar'
// import { api } from 'boot/axios'

// PROPS
const props = defineProps({
  modelValue: Boolean,
  // data: Array,
})

// EMITS
const emit = defineEmits(['update:modelValue', 'triggerAction'])

// QUASAR
// const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// STATE
// const btnLoading = ref(false)

const search = ref('')

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

const rows = [
  {
    name: 'cnh',
  },
  {
    name: 'nada consta',
  },
  {
    name: 'seguro obrigatório',
  },
  {
    name: 'foto com cnh',
  },
]

// COMPUTED

// LIFECYCLE
function beforeShow() {
  // btnLoading.value = false
}

// ACTION

// function request(payload) {
//   api
//     .post(payload, {
//       usuarios: props.data,
//     })
//     .then((response) => {
//       btnLoading.value = false
//       model.value = false

//       $q.notify({
//         type: 'positive',
//         message: response.data.message,
//       })

//       emit('deleted')
//     })
//     .catch((error) => {
//       btnLoading.value = false

//       $q.notify({
//         type: 'warning',
//         message: error.response?.data?.message || 'Erro na operação',
//       })
//     })
// }
</script>
