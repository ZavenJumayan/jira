import{Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {TestComponent} from "@/feat/component";
export default function Home() {
  return(
      <>
          <Input/>
    <div className="flex  justify-center gap-2">
      <Button variant="ghost" size="lg">ghost</Button>
        <Button variant="secondary" size='lg'>secondary</Button>
        <Button variant="destructive" size='lg'>destructive</Button>
        <Button variant='primary' size='xs'>primary</Button>
         <Button variant="outline" size='lg'>outline</Button>
         <Button variant="muted" size='lg'>muted</Button>
        <Button variant="territary" size='lg'>territary</Button>
    </div>
      </>
  )
  ;
}
