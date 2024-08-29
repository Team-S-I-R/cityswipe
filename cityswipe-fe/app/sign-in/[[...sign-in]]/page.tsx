import { SignIn } from '@clerk/nextjs';
import Header from '@/app/cs-componets/header';
const SignInPage = () => {
  return (
    <>

        <div className="h-[100vh] w-[100vw] flex place-items-center place-content-center flex-col">
          <Header/>
        <div className='h-full flex place-items-center place-content-center scale-[80%] md:scale-[100%] '>
          <SignIn/>
        </div>
      </div>

    </>
  );
};
export default SignInPage;