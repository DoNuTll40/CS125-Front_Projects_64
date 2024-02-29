import { icon } from "@fortawesome/fontawesome-svg-core";
import { faAnglesLeft, faBackward, faBackwardStep, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/UseAuth";

export default function PageFound() {

    const { user } =  useAuth()

    const navigate = useNavigate();
    document.title = "404 Not found"

    const hdlBack = () => {
        user?.user_id? navigate(-1) : navigate('/')
    }

    return (
        <div className="flex items-center flex-col justify-center h-screen w-screen">
            <h1 className="text-4xl my-2 font-bold">Page</h1>
            <h1 className="text-2xl font-bold">404 Not Found</h1>
            <button className="text-xl font-bold mt-5  hover:bg-white active:bg-white active:text-base-300 hover:text-base-300 hover:gap-2 active:gap-2 scale-100 active:scale-95 transition ease-linear px-5 py-2 rounded-lg flex items-center justify-center" onClick={hdlBack}><FontAwesomeIcon className="mr-1" icon={faAnglesLeft} />Back</button>
        </div>
    )
}
