<template>
  <q-item>
    <q-item-section top avatar>
      <q-avatar rounded color="primary" text-color="white" icon="directions_car"> </q-avatar>
      <q-badge class="q-mt-sm" :label="props.veiculo.marca" color="grey-7" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-bold"> {{ props.veiculo.modelo }}</q-item-label>
      <q-item-label class="estilo-coluna">
        {{ props.veiculo.renavam }}
        <div>PLACA: {{ props.veiculo.placa }}</div>
        <div>COR: {{ props.veiculo.cor }}</div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  veiculo: [Object],
})

// const badgeColor = (status) => {
//   if (status === 'ativo') return 'green'
//   if (status === 'inativo') return 'orange'
//   if (status === 'pendente') return 'warning'
//   if (status === 'bloqueado') return 'red'
// }
</script>
