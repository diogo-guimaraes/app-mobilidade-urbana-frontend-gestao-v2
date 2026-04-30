<template>
  <q-item>
    <q-item-section top avatar>
      <q-avatar icon="attach_file" size="xl" rounded> </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-h6"> {{ props.documento.titulo }}</q-item-label>
      <q-item-label class="estilo-coluna" caption>
        {{ props.documento.descricao }}
      </q-item-label>
      <!-- <q-item-label caption>
        <q-badge
          :color="badgeColor(props.documento.status)"
          :label="props.documento.status ? props.documento.status : 'Não enviado'"
        />
      </q-item-label> -->
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  documento: [Object],
})

// const badgeColor = (status) => {
//   if (status === 'aprovado') return 'green'
//   if (status === 'reprovado') return 'red'
//   if (status === 'em_analise') return 'orange'
//   return 'grey'
// }
//
</script>
