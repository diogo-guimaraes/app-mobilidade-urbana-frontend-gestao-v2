<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow" @before-hide="onBeforeHide">
      <q-card style="width: 600px; max-width: 50vw">
        <!-- HEADER -->
        <q-toolbar>
          <q-avatar rounded size="md" icon="directions_car" color="primary" text-color="white" />
          <q-toolbar-title>
            <span class="text-weight-bold"> Adicionar veículo ao motorista </span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-separator />
        <!-- <pre>
          {{ data }}
        </pre> -->
        <q-card-section>
          <q-select
            class="full-width"
            filled
            borderless
            v-model="veiculoId"
            :options="optionsVeiculos"
            label="Digite a placa do veículo"
            option-label="placa"
            use-input
            emit-value
            map-options
            @filter="filter"
          >
            <!-- @input="inputPMOrcamentos" -->
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section avatar>
                  <q-icon name="directions_car" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <span style="font-weight: bold">Placa:</span>
                    {{ scope.opt.placa }}
                  </q-item-label>
                  <q-item-label>
                    <span style="font-weight: bold">Modelo:</span>
                    {{ scope.opt.modelo }} - {{ scope.opt.ano_modelo }}
                  </q-item-label>
                  <q-item-label>
                    <span style="font-weight: bold">Marca:</span>
                    {{ scope.opt.marca }}
                  </q-item-label>
                  <!-- <q-item-label>
                    {{ scope.opt.ano_modelo }}
                  </q-item-label> -->
                  <!-- <q-item-label caption>
                    Data
                    {{ format_date(scope.opt.update_et) }}
                  </q-item-label> -->
                  <q-item-label>
                    <q-badge :color="badgeColor(scope.opt.status)">
                      {{ scope.opt.status }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

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
const optionsVeiculos = ref(null)

// const loading = ref(false)
// const search = ref('')

// const dialog = ref(false)
const data = ref([])
const veiculoId = ref('')

// COMPUTED

// LIFECYCLE
function beforeShow() {
  data.value = []
  getVeiculos()
}

function onBeforeHide() {
  data.value = []
}

// ACTION

const filter = async (val, update) => {
  console.log(val, 'val')
  // await this.$nextTick()
  const needle = val.toLowerCase()
  if (needle === '') {
    optionsVeiculos.value = []
  } else {
    await getVeiculos(val)
    optionsVeiculos.value = data.value.filter((v) => v.placa.toLowerCase().indexOf(needle) > -1)
  }
  update()
}

const badgeColor = (status) => {
  if (status === 'ativo') return 'green'
  if (status === 'inativo') return 'orange'
  if (status === 'pendente') return 'warning'
  if (status === 'bloqueado') return 'red'
}

// const onRequest = async (props) => {
//   console.log(props, 'props')
//   await request(props)
// }

const getVeiculos = async (placa) => {
  console.log(placa, 'placa')
  try {
    const response = await api.get(`veiculo-por-placa/${placa}`)
    console.log(response, 'response')
    data.value = response.data
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
