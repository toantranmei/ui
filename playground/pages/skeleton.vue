<template>
  <div class="flex items-center space-x-4">
    <MeiSkeleton
      class="h-12 w-12"
      :ui="{ rounded: 'rounded-full' }"
    />
    <div class="space-y-2">
      <MeiSkeleton class="h-4 w-[250px]" />
      <MeiSkeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>
