import { Outlet } from 'react-router-dom'

import { Nav } from '../components/nav'

export function Root() {
  return (
    <div className="text-dark bg-white dark:bg-black dark:text-white">
      <Nav />
      <section className="p-8">
        <Outlet />
      </section>
    </div>
  )
}
