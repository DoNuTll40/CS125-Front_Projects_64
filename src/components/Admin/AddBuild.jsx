
import axiosPath from "../../configs/axios-path";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddBuild() {

    const navigate = useNavigate();

    const [input, setInput] = useState({
        build_name: "",
        build_number: "",
    })
    const [selectFile, setSelectFile] = useState(null)
    const [disBtn, setDisBtn] = useState(false)

    const fileInput = useRef(null)

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlSubmit = async () => {
        try {
            const file = fileInput.current.files[0];
            setDisBtn(true)
            if (!input.build_name || !input.build_number || !file) {
                setDisBtn(false)
                return alert("กรุณาป้อนข้อมูลให้ครบ")
            }

            const formData = new FormData();

            Object.entries(input).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (file) {
                formData.append('imageBuild', file);
            }
            const token = localStorage.getItem('token')
            const rs = await axiosPath.post('/admin/builds', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (rs.status === 200) {
                setDisBtn(false)
                Swal.fire({
                    icon: 'success',
                    title: "เพิ่มข้อมูลเรียบร้อยแล้ว",
                    text: "ระบบได้เพิ่มข้อมูลอาคารเรียนเรียบร้อยแล้ว",
                })
                hdlClear();
                setSelectFile(null)
            }
        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }
    }

    const hdlClear = () => {
        setInput({
            build_name: "",
            build_number: "",
        })
        fileInput.current.value = null
        setSelectFile(null)
    }

    const hdlChangeFile = () => {
        const file = fileInput.current.files[0]
        setSelectFile(file)
    }


    return (
        <div data-theme="light" className="max-w-[53rem] min-h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-xl text-center font-extrabold">เพิ่มอาคาร</p>
            {!disBtn ? (
                <>
                    <form className="flex gap-2 mt-2 w-full">
                        <div className="w-1/2">
                            <p className='font-bold'>ชื่ออาคาร</p>
                            <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.build_name !== "" ? "border-[#FF609C]" : ""}`} name="build_name" type='text' value={input.build_name} onChange={hdlChange} placeholder='พิมพ์ชื่ออาคาร' />
                        </div>
                        <div className="w-1/2">
                            <p className='font-bold'>เลขอาคาร</p>
                            <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.build_number !== "" ? "border-[#FF609C]" : ""}`} type="text" name="build_number" onChange={hdlChange} value={input.build_number} placeholder='พิมพ์เลขอาคาร' />
                        </div>
                    </form>
                    <div className="w-full mt-3">
                        <p>ใส่ภาพถ่ายอาคาร</p>
                        <input className="block w-full focus:outline-none py-2 rounded-lg bg-gray-50 cursor-pointer mt-1 file:rounded-md file:mx-2 file:py-2 file:px-4 file:border-0" type="file" ref={fileInput} onChange={hdlChangeFile} accept="image/*" />
                        {selectFile !== null && (
                            <img className="max-w-[85%] sm:max-w-[50%] mx-auto rounded-lg my-2 shadow-md border-2 border-white" src={URL.createObjectURL(selectFile)} alt="ภาพตัวอย่าง" />
                        )}
                    </div>
                </>
            ) : (
                <div className="my-5 flex justify-center items-center scale-110">
                    <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 0116 0" />
                    </svg>
                </div>
            )}
            <div className='flex justify-end gap-1 mt-5 mb-3'>
                <button className={`border-2 border-[#FF609C] ${disBtn ? 'w-2/4' : 'w-1/4'} ${disBtn ? 'md:w-40' : 'md:w-28'} py-2 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`} type='submit' disabled={disBtn} onClick={hdlSubmit}>{!disBtn ? "เพิ่มข้อมูล" : <div className="flex gap-2 justify-center"><span className="loading loading-spinner loading-md"></span>กำลังอัพโหลด</div>}</button>
                {!disBtn && (
                    <>
                        <button className='border-2 border-[#FF609C] w-1/4 md:w-28 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={hdlClear}>ล้างข้อมูล</button>
                        <button className='border-2 border-[#FF609C] w-1/4 md:w-28 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
                    </>
                )}
            </div>
            <hr />
        </div>
    )
}
