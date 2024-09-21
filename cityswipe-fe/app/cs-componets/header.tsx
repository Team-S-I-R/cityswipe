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
import {
  SignInButton,
  SignedIn,
  SignOutButton,
  SignUpButton,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import clogo from '../assets/imgs/path6.png'
import { MenuIcon, X } from "lucide-react";
import { useState } from "react";
import useGSAP from '@gsap/react'
 
  export default function Header() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

        {/* desktop */}
        <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="hidden sm:flex absolute z-[20] top-10 px-8 w-full place-items-center place-content-center justify-between">
        
          <>
            <Link href="/">
            <div className="flex gap-2 place-items-center place-content-center">
                {/* <img src={clogo.src} className="w-max h-[10px] mt-1"/> */}
                <h1 className="select-none text-[15px] font-bold ">Cityswipe</h1>
            </div>
            </Link>

            <div className="flex text-[12px] select-none gap-4 place-items-center place-content-center">

                <SignedOut>

                  <Link href="/sign-in">
                    <button className="shadow-md hover:shadow-lg hover:scale-[97%] px-4 py-2 rounded-lg">Log In</button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="shadow-md px-4 py-2 hover:shadow-lg hover:scale-[97%] rounded-lg text-white bg-gradient-to-t from-cyan-500 to-green-400">Sign Up</button>
                  </Link>
                              
                </SignedOut>
                
                <SignedIn>

                <div className="flex place-items-center place-content-center text-[12px]">

                  <Link href="/match">
                    <button className="text-muted-foreground hover:text-black hover:scale-[97%] px-4 py-2 rounded-lg">Match</button>
                  </Link>

                  <Link href="/explore">
                    <button className="text-muted-foreground hover:text-black hover:scale-[97%] px-4 py-2 rounded-lg">Chat</button>
                  </Link>
           
                  <Link href="/pricing">
                    <button className="text-muted-foreground hover:text-black hover:scale-[97%] px-4 py-2 rounded-lg">Pricing</button>
                  </Link>
                  
              </div>
                
                  <UserButton />
                
                </SignedIn>
            </div>

            </>
        
        </motion.div>  

        {/* Mobile */}
        <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="flex sm:hidden absolute z-[20] top-5 px-8 w-full place-items-center place-content-center justify-between">
        
          <>
            <Link href="/">
            <div className="flex gap-2 place-items-center place-content-center">
                {/* <img src={clogo.src} className="w-max h-[10px] mt-1"/> */}
                <h1 className="select-none text-[15px] ">Cityswipe</h1> 
            </div>
            </Link>

            <div >
              <MenuIcon className="cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} /> 
            </div>



            </>
        
        </motion.div>  

        {mobileMenuOpen && (
          <>
          <div className="px-8 py-[20.5px] w-[100dvw] flex gap-5 flex-col justify-between right-0 top-0 h-[100dvh] bg-white absolute z-[20]">
            
            <div className="flex w-full justify-between" >
              <span>
                <h1 className="select-none text-[15px] ">Cityswipe</h1> 
              </span>
              <X  className="cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} /> 
            </div>

            <div className="w-full h-[1px] bg-gray-500"></div>

            <div className="h-full flex flex-col w-full justify-between">
               
               {/* the menu items start here */}

                  <SignedIn>
                  
                    <div className="flex w-[100%] flex-col">
                      <Link href="/">
                        <button className="w-full flex place-items-start text-muted-foreground hover:text-black py-2 rounded-lg">Home</button>
                      </Link>
                      <Link href="/explore">
                        <button className="w-full flex place-items-start text-muted-foreground hover:text-black py-2 rounded-lg">Chat</button>
                      </Link>
                      <Link href="/quiz">
                        <button className="w-full flex place-items-start text-muted-foreground hover:text-black py-2 rounded-lg">Quiz</button>
                      </Link>
                      <Link href="/match">
                        <button className="w-full flex place-items-start text-muted-foreground hover:text-black py-2 rounded-lg">Match</button>
                      </Link>
                    </div>

                   
                    <div className="w-full py-2 h-max flex flex-col gap-2">
                  
                        <div className="w-full flex place-content-center text-muted-foreground shadow-md px-4 py-2 my-2 hover:shadow-lg rounded-lg text-white bg-gradient-to-t from-cyan-500 to-green-400">
                          <SignOutButton />
                        </div>

                        <div className="w-full h-[1px] bg-gray-500"></div>

                        <div className="flex w-[100%] py-4 flex-col">
                            <span className="text-[12px] text-muted-foreground">Cityswipe 2024</span>
                        </div>

                    </div>


                  </SignedIn>


                  <SignedOut>
                  
                  <div className="flex w-[100%] flex-col">
                    <Link href="/">
                      <button className="w-full flex place-items-start text-muted-foreground hover:text-black py-2 rounded-lg">Home</button>
                    </Link>
                  </div>

                 
                  <div className="w-full py-2 h-max flex flex-col gap-2">
                
                      <div className="w-full flex place-items-start text-muted-foreground hover:text-black py-2 rounded-lg">
                        <Link className="w-full" href="/sign-in">
                          <button className="shadow-md w-full hover:shadow-lg  px-4 py-2 rounded-lg">Log In</button>
                         </Link>
                      </div>
                      <div className="w-full flex place-items-start text-muted-foreground hover:text-black py-2 rounded-lg">
                        <Link className="w-full" href="/sign-up">
                          <button className="shadow-md w-full px-4 py-2 hover:shadow-lg rounded-lg text-white bg-gradient-to-t from-cyan-500 to-green-400">Sign Up</button>
                        </Link>
                      </div>

                      <div className="w-full h-[1px] bg-gray-500"></div>

                      <div className="flex w-[100%] py-4 flex-col">
                          <span className="text-[12px] text-muted-foreground">Cityswipe 2024</span>
                      </div>

                  </div>


                </SignedOut>


                {/* the menu items end here */}

            </div>
          
          </div>
          </>
        )}
          
        </>
    )
}
