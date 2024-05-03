<template>
  <MeiPagination
    :prev-button="{
      icon: 'i-heroicons-arrow-small-left-20-solid',
      label: 'Prev',
      color: 'gray',
    }"
    :next-button="{
      icon: 'i-heroicons-arrow-small-right-20-solid',
      trailing: true,
      label: 'Next',
      color: 'gray',
    }"
    :model-value="1"
    :total="100"
  />
</template>
