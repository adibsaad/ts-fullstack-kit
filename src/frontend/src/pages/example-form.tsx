import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { FaCircleXmark, FaPlus } from 'react-icons/fa6'
import { Navigate } from 'react-router-dom'

import { gql } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { omit } from 'lodash-es'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { CenteredSpinner } from '@frontend/components/centered-spinner'
import { InputField } from '@frontend/components/form/input-field'
import { Button } from '@frontend/components/ui/button'
import { Form } from '@frontend/components/ui/form'
import {
  useResourcesQuery,
  useSaveResourcesMutation,
} from '@frontend/graphql/generated'

import { v } from '../helpers'
import { useCurrentUser } from '../hooks/current-user'

const formSchema = z.object({
  resources: z
    .array(
      z.object({
        id: z.string(),
        field: z.string().url().min(1),
        remove: z.boolean().optional(),
        new: z.boolean().optional(),
      }),
    )
    .min(1),
})

type FormValues = z.infer<typeof formSchema>

gql(`
  query Resources {
    resources {
      id
      field
    }
  }
`)

gql(`
  mutation SaveResources($resources: [ResourceInput!]!) {
    saveResources(resources: $resources) {
      id
      field
    }
  }
`)

function ResourceForm({
  initialData,
}: {
  initialData: FormValues['resources']
}) {
  const { currentUser } = useCurrentUser()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resources: initialData,
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'resources',
    keyName: 'key',
  })

  const [mutateAsync] = useSaveResourcesMutation()

  const onSubmit = (data: FormValues) =>
    mutateAsync({
      variables: {
        resources: data.resources.map(resource =>
          omit(resource, ['__typename']),
        ),
      },
    }).then(res => {
      if (!res.data?.saveResources) {
        toast.error('Failed to save')
        return
      }

      toast.success('Saved')
      form.reset({
        resources: res.data.saveResources,
      })

      form.trigger()
    })

  if (!currentUser) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={v(form.handleSubmit(onSubmit))}>
          <div className="mb-5">
            {fields.map((field, index) => (
              <React.Fragment key={field.key}>
                {field.remove ? null : (
                  <div className="mb-2 flex items-center justify-between">
                    <InputField
                      control={form.control}
                      name={`resources.${index}.field`}
                      label="URL"
                    />

                    <FaCircleXmark
                      onClick={() => {
                        if (field.new) {
                          remove(index)
                        } else {
                          update(index, {
                            ...omit(field, ['key']),
                            remove: true,
                          })
                        }
                      }}
                      className="ml-4 cursor-pointer"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}

            <div className="mt-2 flex justify-center">
              <FaPlus
                className="cursor-pointer"
                onClick={() =>
                  append({
                    id: uuid(),
                    field: '',
                    new: true,
                  })
                }
              >
                Add
              </FaPlus>
            </div>
          </div>

          <div className="mt-5 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => form.reset()}
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              Cancel
            </Button>
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export function ExampleForm() {
  const { data, loading } = useResourcesQuery()

  if (loading) {
    return <CenteredSpinner />
  }

  if (!data?.resources) {
    return null
  }

  return (
    <>
      <div className="text-center text-xl font-bold">URLs Form</div>
      <div className="text-center">A list of URLs</div>
      <ResourceForm initialData={data.resources} />
    </>
  )
}
