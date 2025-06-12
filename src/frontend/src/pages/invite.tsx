import { useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'

import { gql } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

import { CenteredSpinner } from '@frontend/components/centered-spinner'
import { InputField } from '@frontend/components/form/input-field'
import { SelectField } from '@frontend/components/form/select-field'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@frontend/components/ui/breadcrumb'
import { Button } from '@frontend/components/ui/button'
import { Form } from '@frontend/components/ui/form'
import {
  InviteUserRole,
  useInviteUserMutation,
} from '@frontend/graphql/generated'
import { v } from '@frontend/helpers'

import { useCurrentUser } from '../hooks/current-user'

const formSchema = z.object({
  email: z.string().email().min(1),
  role: z.union([z.literal('member'), z.literal('admin')]),
})

type FormValues = z.infer<typeof formSchema>

gql(/* GraphQL */ `
  mutation InviteUser($email: String!, $role: InviteUserRole!) {
    inviteUser(email: $email, role: $role) {
      __typename

      ... on Error {
        message
      }

      ... on MutationInviteUserSuccess {
        data
      }
    }
  }
`)

function InviteForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  })

  const [invite] = useInviteUserMutation()

  const onSubmit = (values: FormValues) => {
    invite({
      variables: {
        email: values.email,
        role:
          values.role === 'admin'
            ? InviteUserRole.Admin
            : InviteUserRole.Member,
      },
    })
      .then(result => {
        if (
          result.data?.inviteUser?.__typename === 'MutationInviteUserSuccess'
        ) {
          toast.success(`Invite was sent`)
          form.reset({
            email: '',
            role: 'member',
          })
        } else {
          toast.error(`Error: ${result.data?.inviteUser?.message}`)
        }
      })
      .catch(err => {
        console.log('error:', err)
      })
  }

  return (
    <div className="mt-5 flex flex-col">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/team">Team</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Invite</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-5 text-2xl font-bold">Invite User</div>
      <Form {...form}>
        <form onSubmit={v(form.handleSubmit(onSubmit))}>
          <InputField
            control={form.control}
            name="email"
            label="Email"
            inputArgs={{
              type: 'email',
            }}
          />
          <SelectField
            control={form.control}
            name="role"
            label="Role"
            items={[
              { value: 'member', label: 'Member' },
              { value: 'admin', label: 'Admin' },
            ]}
          />
          <div className="mt-5 flex justify-end space-x-2">
            <Button disabled={form.formState.isSubmitting}>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export function Invite() {
  const { isLoading, currentUser } = useCurrentUser()

  if (isLoading) {
    return <CenteredSpinner />
  }

  if (!currentUser) {
    return <Navigate to="/" />
  }

  return <InviteForm />
}
