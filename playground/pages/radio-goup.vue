<template>
  <div>
    radio-group:
    <mei-radio-group
      v-model="selected"
      legend="Choose something"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
const options = [{
  value: 'email',
  label: 'Email'
}, {
  value: 'sms',
  label: 'Phone (SMS)'
}, {
  value: 'push',
  label: 'Push notification'
}]

const selected = ref('sms')
</script>
