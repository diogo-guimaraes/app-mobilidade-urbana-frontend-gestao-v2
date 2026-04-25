<template>
  <section>
    <q-card>
      <!-- HEADER -->

      <!-- <pre>
          {{ selected }}
        </pre
      > -->

      <q-table
        :loading="loading"
        flat
        :rows="data"
        :columns="columns"
        row-key="documento"
        hide-bottom
        selection="single"
        v-model:selected="selected"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox v-model="props.selected" />
            </q-td>
            <q-td key="name" :props="props">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar rounded>
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6"> {{ props.row.documento }}</q-item-label>
                  <q-item-label class="estilo-coluna" caption>
                    {{ props.row.descricao }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </section>
</template>

<script setup>
// import { computed, ref } from 'vue'
import { ref } from 'vue'

// PROPS
// const props = defineProps({
//   modelValue: Boolean,
//   data: Array
// })

// EMITS
// const emit = defineEmits(['update:modelValue'])

// QUASAR
// const $q = useQuasar()

// MODEL
// const model = computed({
//   get: () => props.modelValue,
//   set: (val) => emit('update:modelValue', val),
// })

// STATE
const selected = ref([])
const data = ref([
  {
    documento: 'CNH',
    descricao: 'CARTEIRA NACIONAL DE HABILITAÇÃO',
  },

  {
    documento: 'SEGURO',
    descricao: 'SEGURO OBRIGATÓRIO',
  },
  {
    documento: 'VEÍCULO - CRLV',
    descricao: 'CERTIFICADO DE REGISTRO E LICENCIAMENTE DO VEÍCULO',
  },
])

const columns = [
  {
    name: 'name',
    label: 'Documento',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
]

// COMPUTED
</script>
<style scoped>
.estilo-coluna {
  max-width: 200px;
  white-space: normal;
  margin-top: 4px;
}
</style>
