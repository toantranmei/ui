import { describe, it, expect } from 'vitest'
import { MeiSkeleton } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Skeleton', () => {
  it.each([
    [ 'basic case', { } ],
    [ '<USkeleton class="h-12 w-12" :ui="{ rounded: \'rounded-full\' }" />' ]
  ])('renders %s correctly', async (nameOrHtml: string, options?: TypeOf<typeof MeiSkeleton.props>) => {
    const html = await ComponentRender(nameOrHtml, options, MeiSkeleton)
    expect(html).toMatchSnapshot()
  })
})
