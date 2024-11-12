import {Button, ButtonProps} from "@/components/ui/button.tsx";

export function MainFormButton(props: ButtonProps) {
  return (
    <Button {...props}
            className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-900 bg-white rounded-[0rem] border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700" ${props.className}`}/>
  )
}
