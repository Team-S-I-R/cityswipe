import { Suspense } from 'react';
import Explore from './page';
export default async function ExploreServer() {
    
    return (
        <>
            <main className="w-screen h-screen">
               <Explore/>
            </main>
        </>
    )
}