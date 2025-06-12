import { builder } from './builder'
import { mutations } from './mutations'
import { queries } from './queries'
import { types } from './types'

queries(builder)
mutations(builder)
types(builder)

export const schema = builder.toSchema()
