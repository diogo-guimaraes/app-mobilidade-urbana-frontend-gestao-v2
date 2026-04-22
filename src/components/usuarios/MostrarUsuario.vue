<template>
  <q-dialog v-model="model">
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
          <div class="col col-12 col-md-5">
            <div class="flex justify-center">
              <q-avatar size="12rem" v-if="form.foto">
                <q-img ratio="1" :src="form.foto">
                  <div class="flex caption absolute-full text-h5 flex-center">
                    <span class="fileinput-button">
                      <span>
                        <q-icon
                          title="Alterar imagem"
                          class="cursor-pointer q-ma-xs"
                          style="font-size: 20px"
                          name="photo_camera"
                          color="white"
                        />
                        <br />
                        Alterar<br />
                        Imagem
                      </span>
                      <input type="file" name="file" @change="handleImagemSelecionada" />
                    </span>
                  </div>
                </q-img>
              </q-avatar>
              <q-avatar color="primary" size="12rem" v-else>
                <div class="flex absolute-full text-h5 flex-center">
                  <span class="fileinput-button">
                    <span>
                      <q-icon
                        title="Adicionar imagem"
                        class="cursor-pointer q-ma-xs"
                        style="font-size: 40px"
                        name="add_photo_alternate"
                        color="white"
                      />
                      <br />
                      Adicionar<br />
                      Imagem
                    </span>
                    <input type="file" name="file" @change="handleImagemSelecionada" />
                  </span>
                </div>
              </q-avatar>
            </div>
            <div class="flex justify-center">
              <q-btn
                flat
                icon="close"
                color="primary"
                label="Remover Imagem"
                @click="form.foto = null"
                v-if="form.foto"
              />
            </div>
          </div>

          <div class="col col-12 col-md-7">
            <div class="row">
              <div class="col col-12 q-px-md q-py-sm">
                <q-input
                  dense
                  outlined
                  class="full-width"
                  label="Nome *"
                  lazy-rules
                  v-model="form.name.value"
                  @input="form.clearError('nome')"
                />
              </div>

              <div class="col col-12 q-px-md q-py-sm">
                <q-input
                  dense
                  outlined
                  class="full-width"
                  label="CPF *"
                  mask="###.###.###-##"
                  :error="form.cpf.error"
                  :error-message="form.cpf.errorMessage"
                  :rules="[(val) => val.length > 0 || 'O CPF é obrigatório']"
                  lazy-rules
                  v-model="form.cpf.value"
                  @input="form.clearError('cpf')"
                />
              </div>

              <div class="col col-12 q-px-md q-py-sm">
                <!-- <q-input
                  dense
                  outlined
                  class="full-width"
                  label="Email *"
                  :error="form.email.error"
                  :error-message="form.email.errorMessage"
                  :rules="[(val) => val.length > 0 || 'O email é obrigatório']"
                  lazy-rules
                  v-model="form.email.value"
                  @input="form.clearError('email')"
                /> -->
              </div>
            </div>
          </div>

          <div class="col col-12 col-md-6 q-px-md q-py-sm">
            <!-- <q-input
              :type="visiblePassword ? 'text' : 'password'"
              dense
              outlined
              class="full-width"
              label="Senha *"
              :error="form.password.error"
              :error-message="form.password.errorMessage"
              :rules="[(val) => val.length > 0 || 'A senha é obrigatória']"
              lazy-rules
              v-model="form.password.value"
              @input="form.clearError('password')"
            >
              <template #append>
                <q-btn
                  flat
                  dense
                  :icon="
                    visiblePassword
                      ? 'sym_o_visibility_off'
                      : 'sym_o_visibility'
                  "
                  @click="visiblePassword = !visiblePassword"
                />
              </template>
            </q-input> -->
          </div>

          <div class="col col-12 col-md-6 q-px-md q-py-sm">
            <!-- <q-input
              dense
              outlined
              class="full-width"
              label="Skill *"
              :error="form.skill.error"
              :error-message="form.skill.errorMessage"
              :rules="[(val) => val.length > 0 || 'A skill é obrigatória']"
              lazy-rules
              v-model="form.skill.value"
              @input="form.clearError('skill')"
            /> -->
          </div>

          <div class="col col-12 col-md-6 q-px-md q-py-sm">
            <!-- <q-input
              dense
              outlined
              class="full-width"
              label="Telefone *"
              mask="(##) ##### - ####"
              :error="form.telefone.error"
              :error-message="form.telefone.errorMessage"
              :rules="[(val) => val.length > 0 || 'O telefone é obrigatório']"
              lazy-rules
              v-model="form.telefone.value"
              @input="form.clearError('telefone')"
            /> -->
          </div>

          <div class="col col-12 col-md-6 q-px-md q-py-sm">
            <!-- <q-input
              dense
              outlined
              class="full-width"
              label="Data de Nascimento *"
              mask="##/##/####"
              :error="form.dataNascimento.error"
              :error-message="form.dataNascimento.errorMessage"
              :rules="[
                (val) => val.length > 0 || 'A data de nascimento é obrigatória',
              ]"
              lazy-rules
              v-model="form.dataNascimento.value"
              @input="form.clearError('dataNascimento')"
            /> -->
          </div>

          <div class="col col-12 col-md-6 q-px-md q-py-sm">
            <!-- <q-select
              dense
              outlined
              class="full-width"
              label="Equipe *"
              :options="options.equipes"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              :error="form.equipe.error"
              :error-message="form.equipe.errorMessage"
              :rules="[(val) => form.equipe.value || 'Selecione uma equipe']"
              :loading="loading.equipes"
              v-model="form.equipe.value"
              @input="form.clearError('equipe')"
            /> -->
          </div>

          <div class="col col-12 col-md-6 q-px-md q-py-sm">
            <!-- <q-select
              dense
              outlined
              class="full-width"
              label="Categoria *"
              :options="options.categorias"
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              :error="form.categoriaGrupo.error"
              :error-message="form.categoriaGrupo.errorMessage"
              :rules="[
                (val) => form.categoriaGrupo.value || 'Selecione uma categoria',
              ]"
              :loading="loading.categorias"
              v-model="form.categoriaGrupo.value"
              @input="form.clearError('categoriaGrupo')"
            /> -->
          </div>

          <div class="col col-12 q-px-md q-py-sm">
            <q-select
              dense
              outlined
              class="full-width"
              label="Regra *"
              option-label="name"
              option-value="id"
              emit-value
              map-options
            >
              <template #append>
                <q-icon name="cancel" class="cursor-pointer" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn class="q-mr-md q-mb-md q-px-md" flat label="Cancelar" v-close-popup />

        <q-btn class="q-mr-md q-mb-md q-px-md" color="primary" label="Salvar" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive } from 'vue'

// PROPS
const props = defineProps({
  modelValue: Boolean,
})

// EMITS
const emit = defineEmits(['update:modelValue', 'salvar'])

// MODEL
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// FORM
const form = reactive({
  name: '',
  data_nascimento: '',
  type: '',
  telefone: '',
  cpf: '',
  email: '',
  foto: null,
  status: '',
  password: '',
})

// STATES
// const showPassword = ref(false)
// const fileInput = ref(null)

// OPTIONS
// const tipos = [
//   { label: 'Motorista', value: 'motorista' },
//   { label: 'Passageiro', value: 'passageiro' },
// ]

// const statusOptions = [
//   { label: 'Ativo', value: 1 },
//   { label: 'Inativo', value: 0 },
// ]

// FILE
// function selectFile() {
//   fileInput.value.click()
// }

// function onFileChange(e) {
//   const file = e.target.files[0]
//   form.foto = file
// }

// // SALVAR
// function salvar() {
//   emit('salvar', { ...form })
//   model.value = false
// }
</script>

<style scoped>
.image-upload {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: #6b57a5;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  transition: 0.3s;
}

.image-upload:hover {
  opacity: 0.9;
}
</style>
