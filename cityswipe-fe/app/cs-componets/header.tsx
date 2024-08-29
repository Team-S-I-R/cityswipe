"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { submitFormResponse } from "../actions";
import { useCitySwipe } from '../citySwipeContext';
import { motion } from "framer-motion";

  export default function Header() {
    const { isStarted } = useCitySwipe();
    const components: { title: string; href: string; description: string }[] = [
        {
          title: "Alert Dialog",
          href: "/docs/primitives/alert-dialog",
          description:
            "A modal dialog that interrupts the user with important content and expects a response.",
        },
        {
          title: "Hover Card",
          href: "/docs/primitives/hover-card",
          description:
            "For sighted users to preview content available behind a link.",
        },
        {
          title: "Progress",
          href: "/docs/primitives/progress",
          description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
        },
        {
          title: "Scroll-area",
          href: "/docs/primitives/scroll-area",
          description: "Visually or semantically separates content.",
        },
        {
          title: "Tabs",
          href: "/docs/primitives/tabs",
          description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
        },
        {
          title: "Tooltip",
          href: "/docs/primitives/tooltip",
          description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        },
      ]

  
    const SubmitButton = () => {
      const status = useFormStatus();
      
      if (status.pending != true) {
        return (
          <button className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-90 font-bold py-2 px-4 rounded" type="submit">Join The Wait list</button>
        )
      }
  
      if (status.pending === true) {
        return (
          <button className="bg-gradient-to-t from-cyan-500 to-green-400 text-white hover:opacity-50 font-bold py-2 px-4 rounded text-gray-600 animate-pulse" disabled>Submitting..</button>
        )
      }
    }

    type FormState = {
      message: string;
    };

    const formAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
      await submitFormResponse(formData, formState);
      return { message: 'Submission successful!' };
    };

    const [formState, action] = useFormState(formAction, {
      message: '',
    });

    const reload = () => {
      window.location.reload();
    }

    return (
        <>    

        <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="flex absolute z-[20] top-10 px-8 w-full place-items-center justify-between">
        
          <>
            <Link href="/">
                <h1 className="select-none text-xl">cityswipe</h1>
            </Link>

            <div className="flex gap-4">
              <Link href="/sign-in">
                <button className="">Log In</button>
              </Link>
              <Link href="/sign-up">
                <button>Sign Up</button>
              </Link>
            </div>

            {/* <Dialog>
              <DialogTrigger><h1 className="select-none font-bold underline">Join Waitlist</h1>
              </DialogTrigger>
              <DialogContent className="scale-[80%] sm:scale-100">
                <DialogHeader>
                  <DialogTitle>Join our wait list for early access!</DialogTitle>
                  <DialogDescription>
                    

                    <p>When we launch you will receive first access to our full beta!</p>

                    <form className="flex flex-col gap-6 my-5" action={action}>
                      
                      <p className="flex place-self-center text-green-500">{formState.message}</p>

                      <Input type="text" name="Name" placeholder="Name" className="w-full" />
                      <Input type="email" name="Email" placeholder="Email address" className="w-full" />
                      <SubmitButton />
                    </form>

                    <p>Thank you for the support!</p>

                    <h1 className="select-none font-bold absolute bottom-0 right-0 m-3">cityswipe</h1>

                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog> */}
            
              {/* <NavigationMenu>
              <NavigationMenuList>
                  <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                          <NavigationMenuLink asChild>
                          <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                          >
                              <span className="h-6 w-6 bg-red-400" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                              shadcn/ui
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                              Beautifully designed components built with Radix UI and
                              Tailwind CSS.
                              </p>
                          </a>
                          </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Introduction">
                          Re-usable components built using Radix UI and Tailwind CSS.
                      </ListItem>
                      <ListItem href="/docs/installation" title="Installation">
                          How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem href="/docs/primitives/typography" title="Typography">
                          Styles for headings, paragraphs, lists...etc
                      </ListItem>
                      </ul>
                  </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                  <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                  <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {components.map((component) => (
                          <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          >
                          {component.description}
                          </ListItem>
                      ))}
                      </ul>
                  </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                      <NavigationMenuLink>
                      Documentation
                      </NavigationMenuLink>
                  </Link>
                  </NavigationMenuItem>
              </NavigationMenuList>
              </NavigationMenu> */}
            </>
        
        </motion.div>  
          
        </>
    )
}

// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   )
// })
// ListItem.displayName = "ListItem"