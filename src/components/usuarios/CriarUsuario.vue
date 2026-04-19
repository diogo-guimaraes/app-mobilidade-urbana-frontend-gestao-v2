<template>
  <q-dialog v-model="model" @before-show="onBeforeShow" @hide="onHide">
    <q-card style="width: 700px; max-width: 80vw">
      <q-toolbar>
        <q-avatar square rounded icon="person" color="primary" text-color="white" />
        <q-toolbar-title>
          <span class="text-weight-bold">Cadastro de Usuário</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <!-- IMAGEM -->
          <div class="col-12 col-md-5">
            <div class="flex justify-center">
              <q-avatar size="12rem" v-if="form.files.image.preview">
                <q-img ratio="1" :src="form.files.image.preview">
                  <div class="absolute-full flex flex-center caption text-h5">
                    <span class="fileinput-button">
                      <q-icon name="photo_camera" color="white" size="20px" />
                      <input type="file" @change="handleImagemSelecionada" />
                    </span>
                  </div>
                </q-img>
              </q-avatar>

              <q-avatar v-else size="12rem" color="primary">
                <div class="absolute-full flex flex-center text-white">
                  <span class="fileinput-button">
                    <q-icon name="add_photo_alternate" size="40px" />
                    <input type="file" @change="handleImagemSelecionada" />
                  </span>
                </div>
              </q-avatar>
            </div>

            <div class="flex justify-center">
              <q-btn
                flat
                icon="close"
                label="Remover Imagem"
                v-if="form.files.image.file"
                @click="form.files.image.file = null"
              />
            </div>
          </div>

          <!-- CAMPOS -->
          <div class="col-12 col-md-7">
            <q-input dense outlined label="Nome *" v-model="form.nome.value" />
            <q-input dense outlined label="CPF *" v-model="form.cpf.value" />
            <q-input dense outlined label="Email *" v-model="form.email.value" />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              :type="visiblePassword ? 'text' : 'password'"
              dense
              outlined
              label="Senha *"
              v-model="form.password.value"
            >
              <template #append>
                <q-btn
                  flat
                  dense
                  :icon="visiblePassword ? 'visibility_off' : 'visibility'"
                  @click="visiblePassword = !visiblePassword"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-input dense outlined label="Skill *" v-model="form.skill.value" />
          </div>

          <div class="col-12 col-md-6">
            <q-input dense outlined label="Telefone *" v-model="form.telefone.value" />
          </div>

          <div class="col-12 col-md-6">
            <q-input dense outlined label="Nascimento *" v-model="form.dataNascimento.value" />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              dense
              outlined
              label="Equipe"
              :options="options.equipes"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              v-model="form.equipe.value"
              :loading="loading.equipes"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              dense
              outlined
              label="Categoria"
              :options="options.categorias"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              v-model="form.categoriaGrupo.value"
              :loading="loading.categorias"
            />
          </div>

          <div class="col-12">
            <q-select
              dense
              outlined
              label="Regra"
              :options="options.regras"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              v-model="form.role.value"
              :loading="loading.regras"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Salvar" :loading="submited" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { api } from 'boot/axios'
// import { success, warning } from 'src/services/notify'
import { useForm } from 'src/utils/useForm'
import { success } from 'src/boot/notify'

// PROPS
const props = defineProps({
  modelValue: Boolean,
})

// EMITS
const emit = defineEmits(['update:modelValue', 'created'])

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

// STATE
const submited = ref(false)
const visiblePassword = ref(false)

const loading = reactive({
  categorias: false,
  equipes: false,
  regras: false,
})

const options = reactive({
  categorias: [],
  equipes: [],
  regras: [],
})

const form = useForm({
  fields: {
    nome: '',
    skill: '',
    telefone: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    equipe: null,
    categoriaGrupo: null,
    role: null,
    password: '',
  },
  files: {
    image: null,
  },
})

// METHODS
const onBeforeShow = () => {
  fetchCategorias()
  fetchEquipes()
  fetchRegras()
}

const onHide = () => {
  form.clear()
  visiblePassword.value = false
}

const handleImagemSelecionada = (e) => {
  form.files.image.file = e.target.files[0]
}

const fetchCategorias = async () => {
  loading.categorias = true
  try {
    const { data } = await api.get('users/categorias')
    options.categorias = data || []
  } finally {
    loading.categorias = false
  }
}

const fetchEquipes = async () => {
  loading.equipes = true
  try {
    const { data } = await api.get('equipes')
    options.equipes = data?.data || []
  } finally {
    loading.equipes = false
  }
}

const fetchRegras = async () => {
  loading.regras = true
  try {
    const { data } = await api.get('regras')
    options.regras = data || []
  } finally {
    loading.regras = false
  }
}

const submit = async () => {
  if (form.hasErrors) return

  submited.value = true

  try {
    const formData = new FormData()

    if (form.files.image.file) {
      formData.append('image', form.files.image.file)
    }

    formData.append('name', form.nome.value)
    formData.append('skill', form.skill.value)
    formData.append('telefone', form.telefone.value)
    formData.append('email', form.email.value)
    formData.append('cpf', form.cpf.value)
    formData.append('data_nascimento', form.dataNascimento.value)
    formData.append('equipe_id', form.equipe.value)
    formData.append('categoria_grupo_id', form.categoriaGrupo.value)
    formData.append('role_id', form.role.value)
    formData.append('password', form.password.value)
    formData.append('c_password', form.password.value)
    formData.append('bot', 0)

    await api.post('users', formData, {
      params: { filtro: 'usuarioCadastrar' },
    })

    success('Usuário cadastrado com sucesso')
    emit('created')
    model.value = false
  } catch (error) {
    console.log(error)
    success('Erro ao cadastrar usuário')
  } finally {
    submited.value = false
  }
}
</script>

<style scoped>
.caption {
  opacity: 0;
  transition: 0.2s;
}
.caption:hover {
  opacity: 1;
}

.fileinput-button {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.fileinput-button input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
}
</style>
