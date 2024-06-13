import { useNuxt, addTemplate } from '@nuxt/kit'

export default function createTemplates (nuxt = useNuxt()) {
  const template = addTemplate({
    filename: 'mei-ui-colors.mjs',
    getContents: () => `export default ${JSON.stringify(nuxt.options.appConfig.meiUI.colors)};`,
    write: true
  })
  const typesTemplate = addTemplate({
    filename: 'mei-ui-colors.d.ts',
    getContents: () => `declare module '#mei-ui-colors' { const defaultExport: ${JSON.stringify(nuxt.options.appConfig.meiUI.colors)}; export default defaultExport; }`,
    write: true
  })

  nuxt.options.alias['#mei-ui-colors'] = template.dst

  nuxt.hook('prepare:types', (opts) => {
    opts.references.push({ path: typesTemplate.dst })
  })
}
