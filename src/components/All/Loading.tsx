import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Loading = () => {
    return (
        <div className="h-screen w-full justify-center items-center flex flex-col gap-4">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl!" />
            <h1 className="font-medium">Loading...</h1>
        </div>
    );
};

export default Loading;
