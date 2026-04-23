<template>
  <q-dialog v-model="model" @before-show="beforeShowDialog">
    <q-card style="width: 700px; max-width: 80vw">
      <!-- HEADER -->
      <q-toolbar>
        <q-avatar square rounded icon="person" color="primary" text-color="white" />

        <q-toolbar-title>
          <span class="text-weight-bold">Editar usuário</span>
        </q-toolbar-title>

        <q-btn flat round dense icon="save" v-if="!loadingDialog" @click="atualizarUsuario" />

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-separator />

      <!-- CONTENT -->
      <div class="row" v-if="!loadingDialog">
        <!-- IMAGEM -->
        <div class="col-12 q-px-md q-py-sm">
          <q-card class="full-width" flat bordered :class="$q.dark.isActive ? 'dark_mode' : ''">
            <q-card-section class="flex justify-center">
              <!-- COM IMAGEM -->
              <q-avatar size="12rem" v-if="user?.foto">
                <q-img ratio="1" :src="user.foto">
                  <div class="flex caption absolute-full text-h5 flex-center">
                    <span class="btn btn-success fileinput-button">
                      <q-icon name="photo_camera" color="white" />
                      <br />Alterar<br />imagem
                      <input type="file" @change="imageSelected" />
                    </span>
                  </div>

                  <div
                    class="flex flex-center absolute-full"
                    style="backdrop-filter: blur(2px)"
                    v-if="image.submit"
                  >
                    <q-spinner color="white" />
                  </div>
                </q-img>
              </q-avatar>

              <!-- SEM IMAGEM -->
              <q-avatar v-else color="primary" size="12rem">
                <q-spinner color="white" v-if="image.submit" />

                <div class="flex absolute-full text-h5 flex-center" v-else>
                  <span class="btn btn-success fileinput-button">
                    <q-icon name="add_photo_alternate" size="40px" color="white" />
                    <br />Adicionar<br />imagem
                    <input type="file" @change="imageSelected" />
                  </span>
                </div>
              </q-avatar>
            </q-card-section>

            <div class="flex justify-center">
              <q-btn
                flat
                icon="close"
                color="primary"
                label="REMOVER IMAGEM"
                @click="removeProfileImage"
                v-if="user.foto"
              />
            </div>
          </q-card>
        </div>

        <div class="col-md-6 col-12 q-px-md q-py-sm">
          <q-input dense outlined v-model="user.name" label="Nome *" />
        </div>

        <div class="col-md-6 col-12 q-px-md q-py-sm">
          <q-input
            dense
            outlined
            v-model="user.telefone"
            label="Telefone *"
            mask="(##) ##### - ####"
          />
        </div>

        <div class="col-md-6 col-12 q-px-md q-py-sm">
          <q-input dense outlined v-model="user.cpf" label="CPF *" mask="###.###.###-##" />
        </div>

        <!-- DATA NASCIMENTO -->
        <div class="col-md-6 col-12 q-px-md q-py-sm">
          <q-input
            dense
            outlined
            v-model="user.data_nascimento"
            label="Data de Nascimento"
            mask="##/##/####"
          />
        </div>

        <!-- EMAIL -->
        <div class="col-12 q-px-md q-py-sm">
          <q-input dense outlined v-model="user.email" label="Email *" />
        </div>

        <div class="col-12 q-px-md q-py-sm">
          <q-select
            class="full-width"
            v-model="user.type"
            :options="userTypes"
            label="Usuario"
            outlined
            dense
            :rules="[(val) => !!val || 'Campo obrigatório']"
          />
        </div>
      </div>

      <!-- <loading-dialog v-else /> -->
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
// import LoadingDialog from 'components/LoadingDialog.vue'

// PROPS
const props = defineProps({
  modelValue: Boolean,
  usuarioId: [String, Number],
})

// EMITS
const emit = defineEmits(['update:modelValue', 'updated'])

// QUASAR
const $q = useQuasar()

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// STATE
const user = reactive({
  name: '',
  skill: '',
  telefone: '',
  cpf: '',
  data_nascimento: '',
  email: '',
})
const userTypes = ref(['passageiro', 'motorista', 'gestao'])

const loadingDialog = ref(false)

const image = reactive({
  data: null,
  submit: false,
})

// API GET USER
async function getUsuario(id) {
  console.log(props.usuarioId, 'props.usuarioId')
  const { data } = await api.get(`/users/${id}`)
  return data
}

// BEFORE SHOW
async function beforeShowDialog() {
  if (!props.usuarioId) return

  // loadingDialog.value = true

  try {
    const data = await getUsuario(props.usuarioId)
    Object.assign(user, data)
  } finally {
    loadingDialog.value = false
  }
}

// IMAGE
function imageSelected(e) {
  const file = e.target.files[0]
  image.data = file
  imageUpload(file)
}

async function imageUpload(file) {
  if (!user?.id || !file) return

  image.submit = true

  const form = new FormData()
  form.append('image', file)

  try {
    await api.put(`/users/${user.id}/image`, form)

    const data = await getUsuario(user.id)
    Object.assign(user, data)

    emit('updated')
    $q.notify({ type: 'positive', message: 'Imagem atualizada com sucesso!' })
  } catch (err) {
    console.log(err)
    image.data = null
    $q.notify({ type: 'negative', message: 'Erro ao enviar imagem' })
  } finally {
    image.submit = false
  }
}

// REMOVE IMAGE
async function removeProfileImage() {
  if (!props.usuarioId) return

  try {
    const deletar = await api.delete(`/usuario-remover-foto-perfil/${props.usuarioId}`)
    const data = await getUsuario(props.usuarioId)
    Object.assign(user, data)

    console.log(deletar, 'deletar')

    // console.log(data, 'datadata')
    emit('updated')
    $q.notify({ type: 'positive', message: 'Imagem removida com sucesso!' })
  } catch (err) {
    console.log(err)
    $q.notify({ type: 'negative', message: 'Erro ao remover imagem' })
  }
}

// UPDATE USER
async function atualizarUsuario() {
  if (!props.usuarioId) return

  try {
    await api.put(`/users/${props.usuarioId}`, {
      name: user.name,
      skill: user.skill,
      email: user.email,
      telefone: user.telefone,
      cpf: user.cpf,
      data_nascimento: user.data_nascimento,
    })

    emit('updated')
    $q.notify({ type: 'positive', message: 'Usuário atualizado com sucesso' })
  } catch (err) {
    console.log(err)

    $q.notify({ type: 'negative', message: 'Erro ao atualizar usuário' })
  }
}
</script>

<style scoped>
/* CSS ORIGINAL MANTIDO */
.caption {
  opacity: 0;
  transition: linear 0.2s;
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
