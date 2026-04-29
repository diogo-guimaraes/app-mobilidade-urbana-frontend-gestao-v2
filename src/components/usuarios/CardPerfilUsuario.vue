<template>
  <q-list :bordered="bordered">
    <q-item>
      <q-item-section top avatar>
        <q-avatar v-if="props.usuario?.foto_thumbnail">
          <img :src="props.usuario?.foto" />
        </q-avatar>
        <q-avatar v-else color="primary" text-color="white">
          {{ props.usuario?.name.substr(0, 1) }}
        </q-avatar>
        <q-badge class="q-mt-sm" :color="badgeColor(props.usuario?.status)">
          {{ props.usuario?.status }}
        </q-badge>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-bold"> {{ props.usuario?.name }}</q-item-label>
        <q-item-label class="estilo-coluna">
          {{ props.usuario?.email }}
          <div>CPF: {{ props.usuario?.cpf }}</div>
          <div>TEL: {{ props.usuario?.telefone }}</div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps({
  usuario: [Object],
  bordered: {
    type: Boolean,
    default: false,
  },
})

const badgeColor = (status) => {
  if (status === 'ativo') return 'green'
  if (status === 'inativo') return 'orange'
  if (status === 'pendente') return 'warning'
  if (status === 'bloqueado') return 'red'
}
</script>
