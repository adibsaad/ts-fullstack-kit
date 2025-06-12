import { useForm } from 'react-hook-form'

import { gql } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

import { CenteredSpinner } from '@frontend/components/centered-spinner'
import { InputField } from '@frontend/components/form/input-field'
import { Button } from '@frontend/components/ui/button'
import { Form } from '@frontend/components/ui/form'
import { useAddMutation, useMyHelloQuery } from '@frontend/graphql/generated'

import { v } from '../helpers'

gql(/* GraphQL */ `
  query MyHello {
    hello
  }
`)

gql(`
  mutation Add($a: Int!, $b: Int!) {
    add(a: $a, b: $b)
  }
`)

const formSchema = z.object({
  a: z.coerce.number().int({
    message: 'Must be an integer',
  }),
  b: z.coerce.number().int({
    message: 'Must be an integer',
  }),
})

type FormValues = z.infer<typeof formSchema>

export function GraphqlQueries() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      a: 1,
      b: 1,
    },
  })

  const { loading: isLoadingHello, data } = useMyHelloQuery()

  const [add] = useAddMutation()

  const onSubmit = (values: FormValues) => {
    add({
      variables: {
        a: values.a,
        b: values.b,
      },
    })
      .then(result => {
        if (result.data) {
          toast.success(`Result: ${result.data?.add}`)
        } else {
          toast.error('Error adding numbers')
        }
      })
      .catch(err => {
        console.log('error:', err)
      })
  }

  if (isLoadingHello) {
    return <CenteredSpinner />
  }

  return (
    <div className="mt-5 flex flex-col">
      <div className="text-center text-3xl font-bold">Hello {data?.hello}</div>

      <div className="mt-5 text-2xl font-bold">Add Numbers</div>
      <Form {...form}>
        <form onSubmit={v(form.handleSubmit(onSubmit))}>
          <InputField
            control={form.control}
            name="a"
            label="A"
            inputArgs={{
              type: 'number',
              step: 1,
            }}
          />
          <InputField
            control={form.control}
            name="b"
            label="B"
            inputArgs={{
              type: 'number',
              step: 1,
            }}
          />
          <div className="mt-5 flex justify-end space-x-2">
            <Button disabled={form.formState.isSubmitting}>Add</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
