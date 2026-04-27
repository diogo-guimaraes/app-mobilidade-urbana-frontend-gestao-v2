<template>
  <section>
    <q-dialog v-model="model" @before-show="beforeShow" @before-hide="onBeforeHide">
      <q-card style="width: 600px; max-width: 50vw">
        <q-toolbar>
          <q-avatar rounded size="md" icon="window" color="primary" text-color="white" />
          <q-toolbar-title>
            <span class="text-weight-bold"> Adicionar veículo ao motorista </span>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <q-card-section class="row items-center q-pb-none">
          <CardPerfilUsuario :usuario="usuario" />
        </q-card-section>

        <q-card-section>
          <q-select
            class="full-width"
            filled
            borderless
            v-model="veiculo"
            :options="optionsVeiculos"
            label="Digite a placa do veículo"
            option-label="placa"
            use-input
            emit-value
            map-options
            clearable
            @filter="filter"
            @update:model-value="confirmarIncluscao($event)"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps || {}" v-on="scope.itemEvents || {}">
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
      <q-dialog v-model="dialog" @before-hide="onBeforeHideSecondary">
        <q-card style="width: 500px; max-width: 50vw">
          <q-card-section class="row items-center q-pb-none">
            <span class="text-h6">Confirme a inclusão do veículo ao motorista</span>
          </q-card-section>
          <q-card-section>
            <div class="row wrap justify-between items-start content-start">
              <CardPerfilVeiculo :veiculo="veiculo" />
              <CardPerfilUsuario :usuario="usuario" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="CANCELAR" color="primary" :loading="loading" v-close-popup />
            <q-btn
              flat
              label="confirmar"
              color="green"
              :loading="loading"
              icon-right="done"
              @click="adicionarVeiculoAoMotorista()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import CardPerfilUsuario from 'src/components/usuarios/CardPerfilUsuario.vue'
import CardPerfilVeiculo from 'src/components/veiculos/CardPerfilVeiculo.vue'

// PROPS
const props = defineProps({
  modelValue: Boolean,
  usuario: [Object],
})

// EMITS
const emit = defineEmits(['update:modelValue', 'hide'])

const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const optionsVeiculos = ref(null)
const dialog = ref(false)
const loading = ref(false)
const data = ref([])
const veiculo = ref('')

watch(model, (val) => {
  if (!val) {
    emit('hide')
  }
})

function beforeShow() {
  veiculo.value = ''
  data.value = []
  getVeiculos()
}

function onBeforeHide() {
  data.value = []
}

function onBeforeHideSecondary() {
  veiculo.value = ''
}

function confirmarIncluscao() {
  if (!veiculo.value) return
  dialog.value = true
}

const filter = async (val, update) => {
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

const getVeiculos = async (placa) => {
  try {
    const response = await api.get(`veiculo-por-placa/${placa}`)
    data.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const adicionarVeiculoAoMotorista = async () => {
  try {
    loading.value = true
    const response = await api.post('adicionar-veiculo-ao-motorista', {
      motorista_id: props.usuario?.id,
      veiculo_id: veiculo.value?.id,
    })
    console.log(response, 'err')
    emit('onRequest')

    $q.notify({ type: 'positive', message: 'Veículo adicionado com sucesso' })
  } catch (err) {
    console.log(err, 'err')
    loading.value = false
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    loading.value = false
    dialog.value = false
    model.value = false
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
