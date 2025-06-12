import { builder } from '../builder'

export const ResourceRef = builder
  .objectRef<{
    id: string
    field: string
  }>('Resource')
  .implement({
    fields: t => ({
      id: t.exposeID('id', { nullable: false }),
      field: t.exposeString('field', { nullable: false }),
    }),
  })
