// File: components/ui/card.tsx
import * as React from "react"

import { cn } from "@/lib/utils" // Ensure lib/utils.ts exists and exports cn

// Card component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Base card styles
      className // Merge custom classes
    )}
    {...props}
  />
))
Card.displayName = "Card"

// CardHeader component
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Header padding and spacing
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// CardTitle component
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Title styles
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// CardDescription component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Description styles
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// CardContent component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // Content padding
))
CardContent.displayName = "CardContent"

// CardFooter component
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)} // Footer padding and layout
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Export all card-related components
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

