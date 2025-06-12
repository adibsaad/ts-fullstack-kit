import { BaseEmail } from '../base'
import templateMjml from '../templates/invite.html'

// Use triple curly braces to avoid escaping the URL
const templateTxt = `
You've been invited to join our platform!

Go here to join: {{{url}}}
`

export class InviteEmail extends BaseEmail<{
  url: string
}> {
  constructor() {
    super(templateMjml, templateTxt)
  }
}
