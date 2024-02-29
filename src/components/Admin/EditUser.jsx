import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function EditUser() {

    const navigate = useNavigate();

    const [getUser, setGetUser] = useState([]);
    const [lock, setLock] = useState(true);
    const userId = location.pathname.split('/')[3]

    const [input, setInput] = useState({
        user_username: "",
        user_password: "",
        confirmPassword: "",
        user_role: "",
        user_firstname: "",
        user_lastname: "",
        user_nickname: "",
        user_email: "",
        user_phone: "",
        user_address: "",
        user_brithday: "",
        user_identity: "",
        user_image: "",
        class_id: ""
    })

    const formatBirthday = input.user_brithday ? new Date(input.user_brithday).toISOString().substr(0, 10) : '';
    document.title = `Edit : ${getUser.user_firstname} ${getUser.user_lastname}`

    useEffect(() => {
        const getUserById = async () => {
            let token = localStorage.getItem('token')
            const rs = await axios.get(`http://localhost:8000/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setGetUser(rs.data.user)
            setInput(rs.data.user)
        }
        getUserById();
    }, [])

    const hdlSubmit = async (e) => {
        e.preventDefault();
        const { user_id, class: classData, ...data } = input;
        const output = { ...data, user_brithday: new Date(input.user_brithday) }

        try {
            let token = localStorage.getItem('token')
            const rs = await axios.patch(`http://localhost:8000/admin/users/${userId}`, output, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(rs.data)
            if(rs.status === 200){
                alert("แก้ไขข้อมูลสำเร็จ")
                navigate(-1)
            }
        } catch (err) {
            alert(err.message)
        }
    }

    const hdlChange = e => {
        setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
    };

    return (
        <div data-theme="light" className="max-w-[53rem] h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
            <p className="text-center">แก้ไขผู้ใช้งาน</p>
            <button className="bg-gray-200 px-2 py-1 rounded-md my-2 active:scale-95" onClick={() => {setLock(!lock); setInput(getUser) }}>{lock ? "แก้ไข" : "ยกเลิก"}</button>
            <form action="" className="" onSubmit={hdlSubmit}>
                <label>ชื่อ <input className="bg-white" type="text" name="user_firstname" disabled={lock} value={input.user_firstname} onChange={hdlChange} /></label>
                <label>นามสกุล <input className="bg-white" type="text" name="user_lastname" disabled={lock} value={input.user_lastname} onChange={hdlChange} /></label>
                <label>ชื่อเล่น <input className="bg-white" type="text" name="user_nickname" disabled={lock} value={input.user_nickname} onChange={hdlChange} /></label>
                <label>อีเมล์ <input className="bg-white" type="text" name="user_email" disabled={lock} value={input.user_email} onChange={hdlChange} /></label>
                <label> เบอร์โทร<input className="bg-white" type="text" name="user_phone" disabled={lock} value={input.user_phone} onChange={hdlChange} /></label>
                <label>ที่อยู่ <input className="bg-white" type="text" name="user_address" disabled={lock} value={input.user_address} onChange={hdlChange} /></label>
                <label>รหัสบัตรประชาชน <input className="bg-white" type="text" name="user_identity" disabled={lock} value={input.user_identity} onChange={hdlChange} /></label>
                <label>วันเกิด <input className="bg-white" type="date" name="user_brithday" disabled={lock} value={formatBirthday} onChange={hdlChange} /></label>
                {!lock ? <button className="bg-gray-200 px-2 py-1 rounded-md my-2 active:scale-95">บันทึก</button> : ""}
            </form> 
        </div>
    )
}
