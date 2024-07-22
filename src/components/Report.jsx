import { useEffect } from "react"

function Report() {

    const role = location.pathname.split("/")[1]

    useEffect( () => {
        document.title = role.slice(0, 1).toUpperCase()+role.slice(1, role.length) + " | รายงานระบบ"
    }, [])

    return (
        <div className='max-w-[53rem] mx-auto p-5 mt-5 bg-white rounded-2xl'>
            <div>
                <h1 className='text-2xl font-bold text-black flex items-center gap-1'>ระบบกำลังอยู่ในช่วงพัฒนา<span className="loading loading-dots loading-md"></span></h1>
            </div>
            <hr />
        </div>
    )
}

export default Report