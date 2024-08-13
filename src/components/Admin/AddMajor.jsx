
import axiosPath from "../../configs/axios-path";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddMajor() {

    const [input, setInput] = useState({
        major_name: "",
    });

    const navigate = useNavigate();

    const hdlReset = () => {
        setInput({
            major_name: "",
        });
    }

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        if (!input.major_name) {
            return Swal.fire({
                title: 'กรุณาป้อนข้อมูลให้ครบ',
                icon: 'warning'
            })
        }
        try {
            let token = localStorage.getItem('token')
            const rs = await axiosPath.post(`/admin/major`, input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (rs.status === 200) {
                Swal.fire({
                    title: "บันทึกข้อมูลเรียบร้อย",
                    icon: 'success',
                }).then(() => {
                    navigate(-1)
                })
            }
        } catch (err) {
            console.log(err)
            Swal.fire({
                text: err.response.data.message,
                title: 'พบข้อผิดพลาด',
                icon: 'error',
            });
        }
    }

    return (
        <div data-theme="light" className="max-w-[53rem] h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-xl text-center font-extrabold">เพิ่มกลุ่มวิชา</p>
            <form className="flex gap-2 mt-2 w-full">
                <div className="w-full">
                    <p className='font-bold'>ชื่อกลุ่มวิชา</p>
                    <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.major_name !== "" ? "border-[#FF609C]" : ""}`} name="major_name" type='text' value={input.major_name} onChange={hdlChange} placeholder='พิมพ์ชื่อกลุ่มวิชา' />
                </div>
            </form>
            <div className='flex justify-end gap-1 mt-5 mb-3'>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type='submit' onClick={hdlSubmit}>เพิ่มข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={hdlReset}>ล้างข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
            </div>
            <hr />
        </div>
    )
}
