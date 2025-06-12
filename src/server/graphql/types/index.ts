import { Builder } from '../builder'
import { subscription } from './subscription'
import { team } from './team'
import { user } from './user'

export function types(builder: Builder) {
  team(builder)
  user(builder)
  subscription(builder)
}
