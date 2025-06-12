import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import './index.css'

import { AuthRoute, UnauthRoute } from './components/auth'
import { Home } from './components/home'
import { MagicLink } from './pages/auth/magic-link'
import { Charts } from './pages/charts'
import { ErrorPage } from './pages/error-page'
import { ExampleForm } from './pages/example-form'
import { GraphqlQueries } from './pages/example-graphql'
import { Invite } from './pages/invite'
import { Login } from './pages/log-in'
import { PaddlePay } from './pages/paddle'
import { Plan } from './pages/plan'
import { Root } from './pages/root'
import { Team } from './pages/team'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'paddle',
        element: <PaddlePay />,
      },
      {
        path: 'login',
        element: (
          <UnauthRoute>
            <Login />
          </UnauthRoute>
        ),
      },
      // auth routes
      {
        path: 'auth',
        children: [
          {
            path: 'magic-link',
            element: <MagicLink />,
          },
        ],
      },
      {
        path: '',
        children: [
          {
            path: '',
            element: <Navigate to="home" />,
          },
          {
            path: 'home',
            element: <Home />,
          },
          {
            path: 'charts',
            element: <Charts />,
          },
          {
            path: 'example-graphql',
            element: <GraphqlQueries />,
          },
        ],
      },
      {
        path: '',
        element: (
          <AuthRoute>
            <Outlet />
          </AuthRoute>
        ),
        children: [
          {
            path: 'example-form',
            element: <ExampleForm />,
          },
          {
            path: 'plan',
            element: <Plan />,
          },
          {
            path: 'team',
            element: <Team />,
          },
          {
            path: 'team/invite',
            element: <Invite />,
          },
        ],
      },
    ],
  },
])
