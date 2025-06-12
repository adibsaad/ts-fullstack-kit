import { Attachment } from 'nodemailer/lib/mailer'

import { BaseEmail } from './base'
import png from './images/logo.png'
import helloTemplateMjml from './templates/hello.html'

const helloTemplateTxt = `
Hello {{user}}!
`

export class HelloEmail extends BaseEmail<
  {
    user: string
  },
  {
    png: string
  }
> {
  constructor() {
    super(helloTemplateMjml, helloTemplateTxt)
  }

  attachments(): Attachment[] {
    return [
      {
        filename: 'logo.png',
        path: `${__dirname}/${png}`,
        cid: 'logo',
      },
    ]
  }

  additionalData() {
    return {
      png: 'cid:logo',
    }
  }
}
