import { getFastifyApp } from '@server/tests/setupTests'

it('responds to root url', async () => {
  const app = await getFastifyApp()
  const res = await app.inject({
    url: '/',
  })
  expect(res.statusCode).toEqual(200)
})
