<template>
  <section>
    <q-dialog @before-show="beforeShow" v-model="model">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <CardPerfilDocumento :documento="documentoSelecionado" />
          <q-form @submit.prevent="onSubmit">
            <q-input
              label="Observação"
              dense
              outlined
              autogrow
              class="full-width q-px-md q-mt-md q-mb-md"
              v-model="documentoSelecionado.observacao"
              type="textarea"
              bottom-slots
              counter
              maxlength="2000"
              :rules="[(val) => val.length >= 3 || 'Campo obrigatório']"
            >
              <template v-slot:hint> Caracteres </template>
            </q-input>
            <div class="q-mt-md" align="center">
              <q-btn type="submit" icon="close" color="red" label="REPROVAR DOCUMENTO" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
// import { computed, ref } from 'vue'

// import { useQuasar } from 'quasar'
// import { api } from 'boot/axios'
import CardPerfilDocumento from 'src/components/motorista/CardPerfilDocumento.vue'
// PROPS
const props = defineProps({
  modelValue: Boolean,
  usuarioId: [String, Number],
  documento: [Object],
})

// EMITS
const emit = defineEmits(['update:modelValue', 'updated'])

// QUASAR
// const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// STATE
const file = ref(null)

// LIFECYCLE
function beforeShow() {
  file.value = null
}

// ACTION

// function request() {
//   const data = new FormData()
//   if (file.value) data.append('arquivo', file.value)
//   data.append('motorista_id', props.usuarioId)
//   data.append('tipo_documento', props.documento.value?.tipo_documento)
//   api
//     .post('/motorista-documentos', data, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//     .then((res) => {
//       $q.notify({ type: 'positive', message: res.data.message })
//       emit('updated')
//       model.value = false
//     })
//     .catch((err) => {
//       $q.notify({ type: 'negative', message: err.response?.data?.message })
//     })
// }
</script>
