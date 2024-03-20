
import axiosPath from "../../configs/axios-path";
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddSchedule() {

  const navigate = useNavigate();
  const [getClass, setGetClass] = useState([]);
  const [getSubject, setGetSubject] = useState([]);
  const [getById, setGetById] = useState([]);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState({
    class_id: "",
    sched_day: "",
    sched_time: "",
    sched_count: "",
    sub_id: "",
    user_id: "",
  });

  useEffect(() => {
    const getClassRoom = async () => {
      try {
        let token = localStorage.getItem('token')
        const rs = await axiosPath.get(`/admin/class`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setGetClass(rs.data.useClass)
      } catch (err) {
        alert(err.message)
      }
    }
    getClassRoom()

    const getSubject = async () => {
      try {
        let token = localStorage.getItem('token')
        const rs = await axiosPath.get(`/admin/subject`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setGetSubject(rs.data.sub);
      } catch (err) {
        console.log(err);
      }
    }
    getSubject();

    const getUser = async () => {
      let token = localStorage.getItem('token')
      const rs = await axiosPath.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUsers(rs.data.user)
    }
    getUser();

  }, [])

  const hdlChange = e => {
    setInput(prv => ({ ...prv, [e.target.name]: e.target.value }))
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    if (!input.class_id || !input.sched_day || !input.sched_time || !input.sched_count || !input.sub_id || !input.user_id) {
      return alert('กรุณาป้อนข้อมูลให้ครบ')
    } else if (input.sched_count < 1 || input.sched_count > 2) {
      return alert('คาบเรียนต้องอยู่ในช่วง 1 ถึง 2 คาบเท่านั้น')
    }
    try {
      let token = localStorage.getItem('token');
      const rs = await axiosPath.post('/admin/schedule', input, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (rs.status === 200) {
        alert("บันทึกข้อมูลเรียบร้อย");
        hdlReset();
      }
    } catch (err) {
      alert(err.response.data.message);
      console.log(err);
    }
  };  

  const hdlReset = () => {
    setInput({
      class_id: "",
      sched_day: "",
      sched_time: "",
      sched_count: "",
      sub_id: "",
      user_id: "",
    });
    document.querySelector('select[name="sub_id"]').selectedIndex = 0;
    document.querySelector('select[name="class_id"]').selectedIndex = 0;
    document.querySelector('select[name="sched_time"]').selectedIndex = 0;
    document.querySelector('select[name="sched_day"]').selectedIndex = 0;
    document.querySelector('select[name="user_id"]').selectedIndex = 0;
  }

  return (
    <div data-theme="light" className="max-w-[53rem] h-[24rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
      <p className="text-xl text-center font-extrabold">เพิ่มตารางเรียน</p>
      <form className="flex gap-2 mt-2">
        <div>
          <p className='font-bold'>ห้องเรียน</p>
          <select className={`w-30 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.class_id !== "" ? "border-[#FF609C]" : ""}`} name="class_id" onChange={hdlChange}>
            <option hidden>เลือกห้อง</option>
            {getClass.filter(el => el.class_name !== "ADMIN" && el.class_name !== "ไม่มีห้อง").map((el, index) => (
              <option key={index} value={el.class_id}>{el.class_name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className='font-bold'>วัน</p>
          <select className={`w-30 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.sched_day !== "" ? "border-[#FF609C]" : ""}`} name="sched_day" onChange={hdlChange}>
            <option hidden>เลือกวัน</option>
            <option value="จันทร์">วันจันทร์</option>
            <option value="อังคาร">วันอังคาร</option>
            <option value="พุธ">วันพุธ</option>
            <option value="พฤหัสบดี">วันพฤหัสบดี</option>
            <option value="ศุกร์">วันศุกร์</option>
          </select>
        </div>
        <div>
          <p className='font-bold'>เวลา</p>
          <select className={`w-30 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.sched_time !== "" ? "border-[#FF609C]" : ""}`} name="sched_time" onChange={hdlChange}>
            <option hidden>เลือกเวลา</option>
            <option value="08:30-09:30">08:30-09:30</option>
            <option value="09:30-10:30">09:30-10:30</option>
            <option value="10:30-11:30">10:30-11:30</option>
            <option value="11:30-12:30">11:30-12:30</option>
            <option value="13:30-14:30">13:30-14:30</option>
            <option value="14:30-15:30">14:30-15:30</option>
            <option value="15:30-16:30">15:30-16:30</option>
          </select>
        </div>
        <div>
          <p className='font-bold'>จำนวนคาบ</p>
          <input className={`w-20 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.sched_count !== "" ? "border-[#FF609C]" : ""}`} type="number" name="sched_count" id="" min="1" max="2" placeholder='1 ถึง 2' step="1" onChange={hdlChange} />
        </div>
        <div>
          <p className='font-bold'>เลือกวิชา</p>
          <select className={`w-[170px] px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white text-ellipsis ${input.sub_id !== "" ? "border-[#FF609C]" : ""}`} name="sub_id" onChange={hdlChange}>
            <option hidden>เลือกวิชาที่ต้องการ</option>
            {getSubject.map(el => (
              <option key={el.sub_id} value={el.sub_id}>{el.sub_name}</option>
            ))}
          </select>
        </div>
        <div>
          <p className='font-bold'>รายชื่ออาจารย์</p>
          <select className={`w-[170px] px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white text-ellipsis ${input.user_id !== "" ? "border-[#FF609C]" : ""}`} name="user_id" onChange={hdlChange}>
            <option hidden>เลือกอาจารย์</option>
            {users.filter(el => el.user_role !== "USER" && el.user_role !== "ADMIN").map(el => (
              <option key={el.user_id} value={el.user_id}>ครู {el.user_firstname} {el.user_lastname}</option>
            ))}
          </select>
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
