import { Area1 } from '@frontend/components/example-charts/area-1'
import { Bar1 } from '@frontend/components/example-charts/bar-1'
import { Pie1 } from '@frontend/components/example-charts/pie-1'
import { Separator } from '@frontend/components/ui/separator'

export function Charts() {
  return (
    <div className="mt-5 flex justify-center">
      <div className="w-[600px] min-w-[200px] flex-col">
        <Bar1 />
        <Separator className="my-2" />
        <Area1 />
        <Separator className="my-2" />
        <Pie1 />
      </div>
    </div>
  )
}
