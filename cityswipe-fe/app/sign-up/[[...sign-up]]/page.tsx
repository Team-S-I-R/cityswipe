import { SignUp } from '@clerk/nextjs';
import Header from '@/app/cs-componets/header';

const SignInPage = () => {
  return (
    <>

        <div className="h-[100dvh] w-[100dvw] flex place-items-center place-content-center flex-col">
          <Header/>
        <div className='h-[70dvh] scale-[80%] md:scale-[100%] '>
        <SignUp/>
        </div>
      </div>

    </>
  );
};
export default SignInPage;