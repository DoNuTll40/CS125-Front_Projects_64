
import { faAnglesLeft, faBackward, faBackwardStep, faBan, faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/UseAuth";
import { useEffect } from "react";

export default function PageFound() {

    const { user } =  useAuth()

    const navigate = useNavigate();
    
    useEffect( () => {
        document.title = "ระบบตารางเรียน | 404 ไม่พบหน้าที่ต้องการ"
    }, [])

    const hdlBack = () => {
        user?.user_id? navigate(-1) : navigate('/')
    }

    return (
        <div className="flex items-center flex-col justify-center h-screen w-screen select-none ">
            <h1 className="text-2xl md:text-4xl my-1 font-bold">เว็บไซต์ ระบบตารางเรียน</h1>
            <h1 className="text-lg md:text-2xl font-bold my-1 flex items-center gap-2"><FontAwesomeIcon shake icon={faBan} className="text-xl mb-1 md:text-3xl" />404 Not Found</h1>
            <h1 className="text-[12px] md:text-1xl font-bold my-2">The requested URL was not found on this server.</h1>
            <button className="text-xl font-bold mt-2 scale-90 active:scale-75 md:scale-100 hover:bg-white active:bg-white active:text-base-300 hover:text-base-300 hover:gap-2 active:gap-2 md:active:scale-95 transition ease-linear px-5 py-2 rounded-lg flex items-center justify-center" onClick={hdlBack}><FontAwesomeIcon className="mr-1 mb-1 md:mt-[0.19rem]" icon={faAnglesLeft} beatFade />Back</button>
        </div>
    )
}
