import { Builder } from '../builder'
import { currentUser } from './current-user'
import { hello } from './hello'
import { resources } from './resources'

export function queries(builder: Builder) {
  builder.queryType({})
  hello(builder)
  currentUser(builder)
  resources(builder)
}
