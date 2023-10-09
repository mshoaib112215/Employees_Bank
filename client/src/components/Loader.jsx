import { ThreeCircles } from "react-loader-spinner";

function Loader({ isTransparent = false }) {
    return (
        // <div className="loader absolute top-1/2 left-1/2 right-1/2 border-none bottom-1/2 w-fit bg-transparent">
        <div className={`loader flex ${isTransparent? '': 'bg-white'}  justify-center items-center w-full h-full`} >
            <ThreeCircles height={100} width={50} radius={10} color={"#ffd600"} />
        </div>
    );
}

export default Loader;
