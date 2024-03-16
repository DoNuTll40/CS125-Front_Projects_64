import { icon } from "@fortawesome/fontawesome-svg-core";
import { faAnglesLeft, faBackward, faBackwardStep, faBan, faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/UseAuth";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

export default function PageFound() {

    const { user } =  useAuth()

    const navigate = useNavigate();
    document.title = "404 Not found"

    const hdlBack = () => {
        user?.user_id? navigate(-1) : navigate('/')
    }

    return (
        <div className="flex items-center flex-col justify-center h-screen w-screen select-none ">
            <h1 className="text-4xl my-2 font-bold">เว็บไซต์ ระบบตารางเรียน</h1>
            <h1 className="text-2xl font-bold my-2 flex items-center gap-2"><FontAwesomeIcon shake icon={faBan} className="text-3xl" />404 Not Found</h1>
            <h1 className="text-1xl font-bold my-5">The requested URL was not found on this server.</h1>
            <button className="text-xl font-bold mt-5  hover:bg-white active:bg-white active:text-base-300 hover:text-base-300 hover:gap-2 active:gap-2 scale-100 active:scale-95 transition ease-linear px-5 py-2 rounded-lg flex items-center justify-center" onClick={hdlBack}><FontAwesomeIcon className="mr-1" icon={faAnglesLeft} beatFade />Back</button>
        </div>
    )
}
