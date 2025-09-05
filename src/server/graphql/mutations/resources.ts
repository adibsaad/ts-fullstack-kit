import { randomUUID } from 'node:crypto'

import type { Builder } from '../builder'
import { ResourceRef } from '../objects/resources'

export function resourcesMut(builder: Builder) {
  const ResourceInput = builder.inputType('ResourceInput', {
    fields: t => ({
      id: t.string({ required: true }),
      field: t.string({ required: true }),
      new: t.boolean({ required: false }),
      remove: t.boolean({ required: false }),
    }),
  })

  builder.mutationField('saveResources', t =>
    t.field({
      type: [ResourceRef],
      args: {
        resources: t.arg({ type: [ResourceInput], required: true }),
      },
      resolve: (_parent, { resources }) => {
        if (resources.some(url => url.remove)) {
          // Delete the resources
        }

        return resources
          .filter(url => !url.remove)
          .map(resource => {
            if (resource.new) {
              return {
                id: randomUUID(),
                field: resource.field,
              }
            }

            return resource
          })
      },
    }),
  )
}
