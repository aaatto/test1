// File: components/ui/label.tsx
"use client" // Uses Radix UI primitive which might need client context

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label" // Dependency for Label
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils" // Ensure lib/utils.ts exists and exports cn

// Define variants (usually just default for label)
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// Define the Label component based on Radix UI Primitive
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)} // Combine base styles and custom classes
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label } // Ensure the component is exported

