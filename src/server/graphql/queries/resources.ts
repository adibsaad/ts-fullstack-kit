import type { Builder } from '../builder'
import { ResourceRef } from '../objects/resources'

export function resources(builder: Builder) {
  builder.queryField('resources', t =>
    t.field({
      type: [ResourceRef],
      resolve: () => {
        return [
          {
            id: '1',
            field: 'https://example.com',
          },
          {
            id: '2',
            field: 'https://example.com',
          },
        ]
      },
    }),
  )
}
