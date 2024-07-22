
import axiosPath from "../../configs/axios-path";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../configs/axios-path";

export default function EditMajor() {

    const [input, setInput] = useState({
        major_name: "",
        major_id: ""
    });

    const id = location.pathname.split("/")[4]

    let token = localStorage.getItem('token');

    const navigate = useNavigate();

    const hdlReset = () => {
        setInput({
            major_name: "",
            major_id: ""
        });
    }

    const getApiMajor = async () => {
        try {
            const rs = await axios.get(`/admin/major/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setInput(rs.data.major)

        }catch(err){
            console.log(err)
        }
    }

    useEffect( () => {

        document.title = `แก้ไขข้อมูลกลุ่มวิชา| ${id}`

        getApiMajor()
    }, [])

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        if (!input.major_name) {
            return alert('กรอกข้อมูลให้ครบทุกช่อง')
        }

        const { major_id, ...data } = input

        try {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.patch(`/admin/major/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (rs.status === 200) {
                alert("แก้ไขข้อมูลเสร็จสิ้น")
                navigate(-1)
            }
        } catch (err) {
            console.log(err)
            alert(err.message, "โปรดแจ้งผู้พัฒนา")
        }
    }

    return (
        <div data-theme="light" className="max-w-[53rem] h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-xl text-center font-extrabold">แก้ไขกลุ่มวิชา</p>
            <form className="grid grid-cols-1 sm:flex gap-2 mt-2 w-full">
                <div className="w-full sm:w-1/2">
                    <p className='font-bold'>ไอดีกลุ่มวิชา</p>
                    <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white disabled:bg-slate-200 disabled:cursor-not-allowed disabled:hover:text-black disabled:hover:font-normal disabled:opacity-70 ${input.major_id !== "" ? "border-[#FF609C]" : ""}`} disabled name="major_id" type='text' value={input.major_id} onChange={hdlChange} placeholder='ไอดีกลุ่มวิชา' />
                </div>
                <div className="w-full sm:w-1/2">
                    <p className='font-bold'>ชื่อกลุ่มวิชา</p>
                    <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.major_name !== "" ? "border-[#FF609C]" : ""}`} name="major_name" type='text' value={input.major_name} onChange={hdlChange} placeholder='ชื่อกลุ่มวิชา' />
                </div>
            </form>
            <div className='flex justify-end gap-1 mt-5 mb-3'>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type='submit' onClick={hdlSubmit}>แก้ไขข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#FF609C]' onClick={hdlReset} disabled>ล้างข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
            </div>
            <hr />
        </div>
    )
}
