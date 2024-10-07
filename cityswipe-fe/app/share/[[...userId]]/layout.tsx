
import SharedItineraryPage from './page';

export default function ShareItineraryServer({ params }: { params: { userId: string[] } }) {
    const userId = params.userId?.join('/') || '';
    console.log('userId: ', userId);

    return (
        <>
           <SharedItineraryPage userId={userId} />
        </>
    );
}