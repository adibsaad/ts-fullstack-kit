import { Builder } from '@server/graphql/builder'

export function add(builder: Builder) {
  builder.mutationField('add', t =>
    t.int({
      args: {
        a: t.arg.int({ required: true }),
        b: t.arg.int({ required: true }),
      },
      resolve: (_parent, { a, b }) => {
        return a + b
      },
    }),
  )
}
