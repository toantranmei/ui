<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#mei-ui/types";

const state = reactive({
  email: undefined,
  password: undefined,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data);
}
</script>

<template>
  <MeiForm
    :validate="validate"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <MeiFormGroup
      label="Email"
      name="email"
    >
      <MeiInput v-model="state.email" />
    </MeiFormGroup>

    <MeiFormGroup
      label="Password"
      name="password"
    >
      <MeiInput
        v-model="state.password"
        type="password"
      />
    </MeiFormGroup>

    <MeiButton type="submit">
      Submit
    </MeiButton>
  </MeiForm>
</template>
