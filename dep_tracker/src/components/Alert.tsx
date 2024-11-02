import {AlertCircle} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {ReactElement} from "react";

interface AlertDestuctiveProps {
  errorType?: string;
  errorMessage?: string
  button?: ReactElement;
}

export function AlertDestructive({errorType, errorMessage, button}: AlertDestuctiveProps) {
  return (
    <Alert className="align-top bg-gray-700 text-white bg-red-900">
      <AlertCircle className="h-4 w-4 stroke-white"/>
      <AlertTitle>{errorType ? errorType : 'Error'}</AlertTitle>
      <AlertDescription className="flex place-content-between">
        {errorMessage ? errorMessage : 'Something went wrong...'}
        {button ? button : ''}
      </AlertDescription>
    </Alert>
  )
}
