
import axiosPath from "../../configs/axios-path";
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function AddBuild() {

    const navigate = useNavigate();

    const [input, setInput] = useState({
        build_name: "",
        build_number: "",
    })

    const fileInput = useRef(null)

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlSubmit = async () => {
        try {
            const file = fileInput.current.files[0];

            if (!input.build_name || !input.build_number || !file) {
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
            console.log(rs.data)
            if (rs.status === 200) {
                alert("เพิ่มข้อมูลเรียบร้อย")
            }
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }

    const hdlClear = () => {
        setInput({
            build_name: "",
            build_number: "",
        })
        fileInput.current.value = null
    }

    return (
        <div data-theme="light" className="max-w-[53rem] h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-xl text-center font-extrabold">เพิ่มอาคาร</p>
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
                <input className="w-full focus:outline-none bg-gray-50 cursor-pointer mt-1" type="file" ref={fileInput} />
            </div>
            <div className='flex justify-end gap-1 mt-5 mb-3'>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type='submit' onClick={hdlSubmit}>เพิ่มข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={hdlClear}>ล้างข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
            </div>
            <hr />
        </div>
    )
}
