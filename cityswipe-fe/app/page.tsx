import Hero from "./homepage";
import Header from "./cs-componets/header";

export default function Home() {




  return (
    <main className="h-[100dvh] overflow-y-scroll no-scrollbar">
      <div className="flex flex-col place-content-center h-[100dvh] w-[100dvw]">
      <Header/>
      <Hero/>
      </div>

    </main>
  );
}
