/* eslint-env jest, node */
import { FastifyInstance } from 'fastify'
import * as matchers from 'jest-extended'
import { enableFetchMocks } from 'jest-fetch-mock'

import { genFastifyApp } from '@server/entrypoints/fastify_app'

let appCached: FastifyInstance
export async function getFastifyApp() {
  return (appCached ||= await genFastifyApp())
}

beforeAll(async () => {
  await getFastifyApp().then(app => app.ready())
})

afterAll(async () => {
  await getFastifyApp().then(app => app.close())
})

expect.extend(matchers)

enableFetchMocks()
