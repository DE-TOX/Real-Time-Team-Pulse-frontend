import { Button } from "@/components/ui/button"

export default function Component({ children, ...props }) {
  return <Button {...props}>{children}</Button>;
}
