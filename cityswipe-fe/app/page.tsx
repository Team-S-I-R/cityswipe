import Hero from "./homepage";
import Header from "./cs-componets/header";

export default function Home() {
  return (
    <main className="h-screen overflow-y-scroll no-scrollbar">
      <div className="flex flex-col place-content-center h-[100vh] w-full">
      <Header/>
      <Hero/>
      </div>

    </main>
  );
}
