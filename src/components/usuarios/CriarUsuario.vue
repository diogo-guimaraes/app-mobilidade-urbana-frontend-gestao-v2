<template>
  <div :class="$q.dark.isActive ? 'dark_mode' : ''">
    <q-dialog v-model="model" @before-show="onBeforeShow" @before-hide="quandoDialogFechar">
      <q-card style="width: 700px; max-width: 80vw" class="row q-col-gutter-sm">
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row">
              <!-- IMAGEM -->
              <div class="col-12">
                <q-card-section class="flex justify-center">
                  <q-avatar size="12rem" v-if="imagemProfile">
                    <q-img ratio="1" :src="imagemProfile">
                      <div class="flex caption absolute-full text-h5 flex-center">
                        <span class="btn fileinput-button">
                          <q-icon name="photo_camera" color="white" />
                          <br />Alterar<br />imagem
                          <input type="file" @change="imageSelected" />
                        </span>
                      </div>
                    </q-img>
                  </q-avatar>

                  <q-avatar v-else color="primary" size="12rem">
                    <div class="flex absolute-full text-h5 flex-center">
                      <span class="btn fileinput-button">
                        <q-icon name="add_photo_alternate" size="40px" color="white" />
                        <br />Adicionar<br />imagem
                        <input type="file" @change="imageSelected" />
                      </span>
                    </div>
                  </q-avatar>
                </q-card-section>

                <div class="flex justify-center">
                  <q-btn
                    v-if="imagemProfile"
                    flat
                    icon="close"
                    color="primary"
                    label="REMOVER IMAGEM"
                    @click="removerImagem"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <!-- INPUTS -->
              <div class="col-md-6 col-12">
                <q-item>
                  <q-input
                    class="full-width"
                    v-model="usuario.name"
                    label="Nome completo *"
                    outlined
                    dense
                  />
                </q-item>
              </div>

              <div class="col-md-6 col-12">
                <q-item>
                  <q-input
                    class="full-width"
                    v-model="usuario.telefone"
                    label="Telefone *"
                    outlined
                    dense
                    mask="(##) ##### - ####"
                  />
                </q-item>
              </div>

              <div class="col-md-6 col-12">
                <q-item>
                  <q-input
                    class="full-width"
                    v-model="usuario.cpf"
                    label="CPF *"
                    outlined
                    dense
                    mask="###.###.###-##"
                  />
                </q-item>
              </div>

              <div class="col-md-6 col-12">
                <q-item>
                  <q-input
                    class="full-width"
                    v-model="usuario.data_nascimento"
                    label="Data Nascimento"
                    outlined
                    dense
                    mask="##/##/####"
                  />
                </q-item>
              </div>

              <div class="col-md-12 col-12">
                <q-item>
                  <q-input
                    class="full-width"
                    v-model="usuario.email"
                    label="Email *"
                    outlined
                    dense
                  />
                </q-item>
              </div>
              {{ usuario }}
              <div class="col-md-6 col-12">
                <q-item>
                  <q-select
                    class="full-width"
                    v-model="usuario.type"
                    :options="userTypes"
                    label="Usuario"
                    outlined
                    dense
                  />
                </q-item>
              </div>

              <div class="col-md-6 col-12">
                <q-item>
                  <q-input
                    class="full-width"
                    v-model="usuario.password"
                    label="Senha"
                    type="password"
                    outlined
                    dense
                  />
                </q-item>
              </div>
            </div>
            <q-card-actions class="q-mt-md" align="center">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn type="submit" color="primary" icon-right="save" label="Salvar" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import moment from 'moment'

// PROPS
const props = defineProps({
  modelValue: Boolean,
})

// EMITS
const emit = defineEmits(['update:modelValue', 'created'])

// Q
const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const image = ref(null)
const imagemProfile = ref('')

// MOCK (substitui Vuex)
const userTypes = ref(['passageiro', 'motorista', 'gestao'])

// FORM
const usuario = reactive({
  name: '',
  telefone: '',
  cpf: '',
  data_nascimento: '',
  email: '',
  password: '',
  type: '',
})

// METHODS
function quandoDialogFechar() {
  limparForm()
}

function limparForm() {
  image.value = null
  imagemProfile.value = ''
  Object.assign(usuario, {
    name: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    email: '',
    password: '',
    type: '',
  })
}

function onBeforeShow() {
  // simulação
  console.log(onBeforeShow)
}

function imageSelected(e) {
  image.value = e.target.files[0]
  const reader = new FileReader()
  reader.readAsDataURL(image.value)
  reader.onload = (ev) => {
    imagemProfile.value = ev.target.result
  }
}

function removerImagem() {
  imagemProfile.value = ''
  image.value = null
}

function onSubmit() {
  cadastrarUsuario()
}

function cadastrarUsuario() {
  // 📅 FORMATAR DATA (DD/MM/YYYY → YYYY/MM/DD)
  console.log(usuario, 'usuario data1')

  const dataFormatada = usuario.data_nascimento
    ? moment(usuario.data_nascimento, 'DD/MM/YYYY').format('YYYY/MM/DD')
    : null
  console.log(usuario, 'usuario data2')

  // 🧼 LIMPAR CPF (remove tudo que não for número)
  const cpfLimpo = usuario.cpf ? usuario.cpf.replace(/\D/g, '') : ''

  const data = new FormData()

  if (image.value) data.append('image', image.value)

  // CLONE para não alterar o objeto original
  const payload = {
    ...usuario,
    data_nascimento: dataFormatada,
    cpf: cpfLimpo,
  }

  Object.keys(payload).forEach((key) => {
    data.append(key, payload[key] ?? '')
  })

  api
    .post('/users', data)
    .then((res) => {
      $q.notify({ type: 'positive', message: res.data.message })
      emit('created')
      model.value = false
    })
    .catch((err) => {
      $q.notify({ type: 'negative', message: err.response?.data?.message })
    })
}
</script>

<style scoped>
/* CSS ORIGINAL MANTIDO */
.caption {
  opacity: 0;
  transition: linear 1s;
}
.caption:hover {
  opacity: 1;
}
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 25px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.btn-success {
  color: #fff;
}
.fileinput-button {
  position: relative;
  overflow: hidden;
}
.fileinput-button input {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  opacity: 0;
  font-size: 200px;
  cursor: pointer;
}
</style>
