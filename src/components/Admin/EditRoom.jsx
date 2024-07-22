
import axiosPath from "../../configs/axios-path";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditRoom() {

    const [build, setBuild] = useState([]);
    const [input, setInput] = useState({
        room_name: "",
        room_number: "",
        build_id: "",
    });

    const navigate = useNavigate();
    const id = location.pathname.split('/')[4];
    let token = localStorage.getItem('token');

    const getSubjectById = async () => {
        try {
          const rs = await axiosPath.get(`/admin/rooms/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setInput(rs.data.room);
        } catch (err) {
          console.log(err);
        }
      };

    const getBuild = async () => {
      const rs = await axiosPath.get(`/admin/builds`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setBuild(rs.data.builds)
    }

    useEffect(() => {

        document.title = `แก้ไขข้อมูลห้องเรียน | ${id}`

        getSubjectById();
        getBuild();
    }, [])

    const hdlReset = () => {
        setInput({
            room_name: "",
            room_number: "",
            build_id: "",
        });
        document.querySelector('select[name="build_id"]').selectedIndex = 0;
    }

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        if (!input.room_name || !input.room_number || !input.build_id) {
            return alert('กรอกข้อมูลให้ครบทุกช่อง')
        }
        try {

            const { room_id, ...data } = input

            const rs = await axiosPath.patch(`/admin/rooms/${id}`, data, {
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
            alert(err.response.data.message)
        }
    }

    return (
        <div data-theme="light" className="max-w-[53rem] h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-xl text-center font-extrabold">แก้ไขชื่อห้อง</p>
            <form className="flex flex-col md:flex-row gap-2 mt-2 w-full">
                <div className="w-full md:w-1/3">
                    <p className='font-bold'>ชื่อห้อง</p>
                    <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.room_name !== "" ? "border-[#FF609C]" : ""}`} name="room_name" type='text' value={input.room_name} onChange={hdlChange} placeholder='พิมพ์ชื่อห้อง' />
                </div>
                <div className="w-full md:w-1/3">
                    <p className='font-bold'>เลขประจำห้อง</p>
                    <input className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.room_number !== "" ? "border-[#FF609C]" : ""}`} type="text" name="room_number" onChange={hdlChange} value={input.room_number} placeholder='พิมพ์เลขห้อง' />
                </div>
                <div className="w-full md:w-1/3">
                    <p className='font-bold'>รายชื่ออาคาร</p>
                    <select className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white text-ellipsis ${input.build_id !== "" ? "border-[#FF609C]" : ""}`} name="build_id" value={input.build_id} onChange={hdlChange}>
                        <option hidden>เลือกอาคารเรียน</option>
                        {build.map((el, number) => (
                            <option key={number} value={el.build_id}>{el.build_name}</option>
                        ))}
                    </select>
                </div>
            </form>
            <div className='flex justify-end gap-1 mt-5 mb-3'>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type='submit' onClick={hdlSubmit}>แก้ไขข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95 disabled:opacity-45 disabled:active:scale-100 disabled:cursor-not-allowed' disabled onClick={hdlReset}>ล้างข้อมูล</button>
                <button className='border-2 border-[#FF609C] w-28 py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
            </div>
            <hr />
        </div>
    )
}
