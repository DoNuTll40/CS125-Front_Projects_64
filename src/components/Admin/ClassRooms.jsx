
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../configs/axios-path";
import { useEffect, useState } from "react";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function ClassRooms() {

    const [getClass, setGetClass] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [classError, setClassError] = useState(false)
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState("");
    const [input, setInput] = useState({
        class_name: "",
        sec_id: "",
    })

    document.title = "Admin : Classrooms"
    let token = localStorage.getItem('token');
    const accordion = document.getElementsByName('my-accordion-2')[0];

    useEffect(() => {

        const Class = async () => {
            try {
                const rs = await axios.get('/admin/class', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (rs.status === 200) {
                    setGetClass(rs.data.useClass)
                }
            } catch (err) {
                console.log(err)
                alert(err.message)
            }
        }

        Class();

    }, [refresh])

    const hdlChange = (e) => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    }

    const hdlSubmit = async (e) => {
        e.preventDefault();

        if(!input.class_name || !input.sec_id){
            setClassError(false)
            return alert("กรุณากรอกข้อมูลให้ครบ")
        }

        try {
            const rs = await axios.post('/admin/class', input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (rs.status === 200) {
                alert(rs.data.message)
                hdlReset()
                setRefresh(prv => !prv)
                setClassError(false)
                document.querySelector('input[type="checkbox"][name="my-accordion-2"]').checked = false;
            }

        } catch (err) {
            console.log(err)
            alert(err.response.data.message)
            setClassError(true)
        }
    }

    const hdlReset = () => {
        setInput({
            class_name: "",
            sec_id: ""
        })
        setClassError(false)
        document.querySelector('select[name="sec_id"]').selectedIndex = 0;
    }

    const hdlRemove = async (id) => {
        if (confirm("คุณต้องการลบข้อมูลหรือไม่") === true) {
            try {
                const rs = await axios.delete(`/admin/class/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (rs.status === 200) {
                    alert(rs.data.message)
                    setRefresh(prv => !prv)
                }
            } catch (err) {
                console.log(err)
                alert(err.message)
            }
        } else {
            alert("คุณได้ยกเลิกการลบเรียบร้อยแล้ว")
        }
    }

    const editButton = async (id) => {

        setEditId(id)

        if (accordion && !accordion.checked) {
            accordion.checked = true;
        }

        try {
            const rs = await axios.get(`/admin/class/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            if(rs.status === 200){
                setInput(rs.data.useClass)
            }
        }catch(err){
            console.log(err)
        }
    }

    const hdlUpdate = async (e) => {
        e.preventDefault();
        const { class_id, section, ...data } = input
        try {
            const id = Number(editId);
            const rs = await axios.patch(`/admin/class/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(rs.status === 200){
                setEdit(false)
                setEditId("")
                hdlReset()
                const accordion = document.getElementsByName('my-accordion-2')[0];
                if (accordion) {
                    accordion.checked = !accordion.checked;
                }
                setRefresh((prev) => !prev);
            }
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="max-w-[80rem] mx-auto mt-3 select-none">
            <div className=" bg-white max-w-[53rem] mx-auto rounded-2xl mt-5 p-5">
                <div className="text-center text-black text-lg font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] mb-2">
                    <h1>รายชื่อชั้นเรียนทั้งหมด</h1>
                </div>
                <hr />
                <div data-theme="light" className="collapse collapse-arrow">
                    <input type="checkbox" name="my-accordion-2" onChange={ e => !e.target.checked ? (hdlReset(), setEdit(false)) : ""}/>
                    <div className="collapse-title text-black text-lg font-semibold">
                        <p>{edit ? "แก้ไขชั้นเรียน" : "เพิ่มชั้นเรียน"}</p>
                    </div>
                    <form className={`collapse-content w-full px-0 ${edit ? "hidden" : "block"}`} onSubmit={hdlSubmit}>
                        <hr />
                        <div className="flex gap-4 mt-5 flex-col md:flex-row">
                            <div className="w-full md:w-1/2 font-medium hover:font-semibold">
                                <p>พิมพ์ชื่อชั้นเรียน</p>
                                <input type="text" name="class_name" id="classname" onChange={hdlChange} value={input.class_name} className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 ${classError ? "focus:border-red-600 border-red-600" : "focus:border-gray-200 border-gray-200"} hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`} placeholder="เช่น ม.1/1" />
                                <p className={`${classError ? "block mt-2 font-bold text-sm text-red-600" : "hidden"}`}>หมายเลขชั้นเรียนมีการซ้ำกัน</p>
                            </div>
                            <div className="w-full md:w-1/2 font-medium hover:font-semibold">
                                <p>เลือกระดับชั้น</p>
                                <select name="sec_id" id="select-sec" onChange={hdlChange} className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`}>
                                    <option hidden>เลือก</option>
                                    <option value={1}>ชั้นประถมศึกษาตอนต้น</option>
                                    <option value={2}>ชั้นประถมศึกษาตอนปลาย</option>
                                    <option value={3}>ชั้นมัธยมศึกษาตอนต้น</option>
                                    <option value={4}>ชั้นมัธยมศึกษาตอนปลาย</option>
                                </select>
                            </div>
                        </div>
                        <button className={`w-full mt-3 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`}>บันทึก</button>
                        <div className={`${input.class_name !== "" || input.sec_id !== "" ? "block transition-opacity duration-1000" : "hidden transition-opacity duration-1000"}`}>
                            <button type="button" onClick={hdlReset} className={`w-full mt-3 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`}>ล้างข้อมูล</button>
                        </div>
                    </form>

                    <form className={`collapse-content w-full px-0 ${!edit ? "hidden" : "block"}`} onSubmit={hdlUpdate}>
                        <hr />
                        <div className="flex gap-4 mt-5 flex-col md:flex-row">
                            <div className="w-full md:w-1/2 font-medium hover:font-semibold">
                                <p>แก้ไขชื่อชั้นเรียน</p>
                                <input type="text" name="class_name" id="classname" onChange={hdlChange} value={input.class_name} className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 ${classError ? "focus:border-red-600 border-red-600" : "focus:border-gray-200 border-gray-200"} hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`} placeholder="เช่น ม.1/1" />
                                <p className={`${classError ? "block mt-2 font-bold text-sm text-red-600" : "hidden"}`}>หมายเลขชั้นเรียนมีการซ้ำกัน</p>
                            </div>
                            <div className="w-full md:w-1/2 font-medium hover:font-semibold">
                                <p>แก้ไขระดับชั้น</p>
                                <select name="sec_id" id="select-sec" onChange={hdlChange} value={input.sec_id} className={`w-full px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`}>
                                    <option hidden>เลือก</option>
                                    <option value={1}>ชั้นประถมศึกษาตอนต้น</option>
                                    <option value={2}>ชั้นประถมศึกษาตอนปลาย</option>
                                    <option value={3}>ชั้นมัธยมศึกษาตอนต้น</option>
                                    <option value={4}>ชั้นมัธยมศึกษาตอนปลาย</option>
                                </select>
                            </div>
                        </div>
                        <button className={`w-full mt-3 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`}>บันทึก</button>
                        <div className={`${input.class_name !== "" || input.sec_id !== "" ? "block transition-opacity duration-1000" : "hidden transition-opacity duration-1000"}`}>
                            <button type="button" onClick={hdlReset} className={`w-full mt-3 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white`}>ล้างข้อมูล</button>
                        </div>
                    </form>
                </div>
                <div className="text-md">
                    <hr />
                    <table className="w-[100%] mt-3 text-black">
                        <thead>
                            <tr className="text-left">
                                <th>ลำดับ</th>
                                <th>หมายเลขห้อง</th>
                                <th>ช่วงชั้น</th>
                                <th colSpan={2} className="text-center w-[25%]">ตัวเลือก</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getClass.filter(el => el.class_name !== "ADMIN").map((el, index) => (
                                <tr key={index + 1} className="hover:font-bold">
                                    <td>{index + 1}</td>
                                    <td>{el.class_name}</td>
                                    <td>{el.section.sec_type === "SECONDARY1" ? "มัธยมชวงชั้นที่ 1" : el.section.sec_type === "SECONDARY2" ? "มัธยมชวงชั้นที่ 2" : el.section.sec_type === "PRIMARY1" ? "ประถมศึกษาชั้นที่ 1" : "ประถมศึกษาชั้นที่ 2"}</td>
                                    <td className="flex justify-center"><button disabled={accordion?.checked} className="flex justify-center items-center py-2 px-2 bg-yellow-300 my-1 rounded-md text-white shadow-md disabled:opacity-60 disabled:cursor-not-allowed" onClick={ () => {setEdit(!edit); editButton(el.class_id)}}><FontAwesomeIcon icon={faEdit}  /><span className="hidden md:block pl-1">แก้ไข</span></button></td>
                                    <td><button className="flex justify-center items-center py-2 px-2 bg-red-600 my-1 rounded-md text-white shadow-md" onClick={() => hdlRemove(el.class_id)}><FontAwesomeIcon icon={faTrashAlt} /><span className="hidden md:block pl-1">ลบข้อมูล</span></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ClassRooms;