import {Button, ButtonProps} from "@/components/ui/button.tsx";
import * as React from "react";

export const MainFormButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <Button ref={ref} {...props}
                 className={"px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-[0rem] border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700" + ' ' + props.className}/>
})
