import MyModule from '../../../src/module'

export default defineNuxtConfig({
  // @ts-expect-error - Typings not available
  modules: [MyModule],
})
