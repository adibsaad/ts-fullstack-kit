import type { Builder } from '../builder'

export function hello(builder: Builder) {
  builder.queryField('hello', t =>
    t.string({
      resolve: () => 'world',
    }),
  )
}
