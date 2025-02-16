
import {Card,CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import {DottedSeparator} from '@/components/dotted-separator'
import {Input} from '@/components/ui/input'
export function SingInCard () {
    return (
        <Card className="w-full h-dull md:w-[487px] border-none shadow-noone">
        <CardHeader className="flex items-center justify-center text-center p-7">
            <CardTitle>
                Welcome back!
            </CardTitle>
        </CardHeader>
            <div className="px-7">
               <DottedSeparator/>
            </div>
            <CardContent className="p-7">
                <form className='space-y-4'>
                    <Input
                        required
                        type="email"
                      value='email'
                        onChange={() => {}}
                        placeholder='Email'
                        disabled={false}
                    />
                </form>
            </CardContent>
        </Card>
    )
}