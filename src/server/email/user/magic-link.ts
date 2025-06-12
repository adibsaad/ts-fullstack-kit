import { BaseEmail } from '../base'
import templateMjml from '../templates/magic-link.html'

// Use triple curly braces to avoid escaping the URL
const templateTxt = `
Here is your login link:
{{{url}}}
`

export class MagicLinkEmail extends BaseEmail<{
  url: string
}> {
  constructor() {
    super(templateMjml, templateTxt)
  }
}
