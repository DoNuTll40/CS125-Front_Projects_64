
import axiosPath from "../../configs/axios-path";
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";

export default function AddSchedule() {

  const navigate = useNavigate();
  const [getClass, setGetClass] = useState([]);
  const [getSubject, setGetSubject] = useState([]);
  const [getById, setGetById] = useState([]);
  const [getScheduleByClick, setGetScheduleByClick] = useState([])
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState({
    class_id: "",
    sched_day: "",
    sched_time: "",
    sched_count: "",
    sub_id: "",
    user_id: "",
  });

  const [refetch, setRefetch] = useState(false)

  let token = localStorage.getItem('token')

  useEffect(() => {

    document.title = `Admin | เพิ่มข้อมูลตารางเรียน`

    const getClassRoom = async () => {
      try {

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

      const rs = await axiosPath.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUsers(rs.data.user)
    }
    getUser();

  }, [refetch])

  const fetchSchedule = async () => {
    try {
      if (input.class_id !== "" || input.sched_day !== "") {
        const rs = await axiosPath.get(`/admin/select/schedule?classID=${input?.class_id}&day=${input?.sched_day}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setGetScheduleByClick(rs.data.schedule)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchSchedule();
  }, [input, refetch])

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
        // hdlReset();
        setRefetch(prev => !prev)
      }
    } catch (err) {
      Swal.fire({
        icon: "warning",
        titleText: "ระบบตรวจพบข้อมูลซ้ำกัน",
        text: err.response.data.message
      })
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
    setGetScheduleByClick([])
  }

  console.log(getScheduleByClick)

  function sortByDay(a, b) {
    const daysOrder = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
    return daysOrder.indexOf(a.sched_day) - daysOrder.indexOf(b.sched_day);
  }

  const sortedSchedules = getScheduleByClick.sort(sortByDay);

  return (
    <div data-theme="light" className="max-w-[53rem] md:min-h-[23rem] text-black mx-auto mt-5 pt-5 pb-2 select-none rounded-2xl px-5 bg-white shadow-lg">
      <p className="text-xl text-center font-extrabold">เพิ่มตารางเรียน</p>
      <form className="flex gap-2 mt-2 flex-col md:flex-row">
        <div className="w-full md:w-1/6">
          <p className='font-bold'>ห้องเรียน</p>
          <select className={`w-full md:w-30 text-ellipsis px-2 py-2 appearance-none hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.class_id !== "" ? "border-[#FF609C]" : ""}`} name="class_id" onChange={hdlChange}>
            <option hidden>เลือกห้อง</option>
            {getClass.filter(el => el.class_name !== "ADMIN" && el.class_name !== "ไม่มีห้อง").map((el, index) => (
              <option key={index} value={el.class_id}>{el.class_name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/5">
          <p className='font-bold'>วัน</p>
          <select className={`w-full md:max-w-30 text-ellipsis appearance-none px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.sched_day !== "" ? "border-[#FF609C]" : ""}`} name="sched_day" onChange={hdlChange}>
            <option hidden>เลือกวัน</option>
            <option value="จันทร์">วันจันทร์</option>
            <option value="อังคาร">วันอังคาร</option>
            <option value="พุธ">วันพุธ</option>
            <option value="พฤหัสบดี">วันพฤหัสบดี</option>
            <option value="ศุกร์">วันศุกร์</option>
          </select>
        </div>
        <div className="w-full md:w-1/5">
          <p className='font-bold'>เวลา</p>
          <select className={`w-full text-ellipsis appearance-none md:max-w-30 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.sched_time !== "" ? "border-[#FF609C]" : ""}`} name="sched_time" onChange={hdlChange}>
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
          <input className={`w-full md:w-20 px-2 py-2 hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white ${input.sched_count !== "" ? "border-[#FF609C]" : ""}`} type="number" name="sched_count" id="" min="1" max="2" placeholder='1 ถึง 2' step="1" onChange={hdlChange} />
        </div>
        <div className="w-full md:w-1/5">
          <p className='font-bold'>เลือกวิชา</p>
          <select className={`w-full px-2 py-2 appearance-none hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white text-ellipsis ${input.sub_id !== "" ? "border-[#FF609C]" : ""}`} name="sub_id" onChange={hdlChange}>
            <option hidden>เลือกวิชาที่ต้องการ</option>
            {getSubject.map(el => (
              <option key={el.sub_id} value={el.sub_id}>{el.sub_name}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/5">
          <p className='font-bold'>รายชื่ออาจารย์</p>
          <select className={`w-full px-2 py-2 appearance-none hover:font-bold border-2 focus:font-bold rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-gray-200 hover:cursor-pointer focus:bg-[#6096B4] hover:bg-[#6096B4] hover:text-white focus:text-white text-ellipsis ${input.user_id !== "" ? "border-[#FF609C]" : ""}`} name="user_id" onChange={hdlChange}>
            <option hidden>เลือกอาจารย์</option>
            {users.filter(el => el.user_role !== "USER" && el.user_role !== "ADMIN").map(el => (
              <option key={el.user_id} value={el.user_id}>ครู {el.user_firstname} {el.user_lastname}</option>
            ))}
          </select>
        </div>
      </form>
      <div className='flex justify-end gap-1 mt-5 mb-3'>
        <button className='border-2 border-[#FF609C] w-1/4 md:w-[16%] py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' type='submit' onClick={hdlSubmit}>เพิ่มข้อมูล</button>
        <button className='border-2 border-[#FF609C] w-1/4 md:w-[16%] py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={hdlReset}>ล้างข้อมูล</button>
        <button className='border-2 border-[#FF609C] w-1/4 md:w-[16%] py-1 rounded-full text-[#FF609C] text-md font-bold scale-100 hover:bg-[#FF609C] hover:text-white hover:drop-shadow-lg transition ease-in-out active:scale-95' onClick={() => navigate(-1)}>ย้อนกลับ</button>
      </div>
      <hr />
      <div className="my-2">
        <div className="pb-10">
          {getScheduleByClick.length !== 0 ?
            <>
              <p className="px-4 text-md font-bold drop-shadow-md">จำนวน {getScheduleByClick.length} ข้อมูล ของชั้น {getScheduleByClick[0]?.class?.class_name} {input.sched_day !== "" ? `และวัน ${input.sched_day}` : ""}</p>
              <div className="hidden md:block">
                <table className='table text-black my-1'>
                  <thead className='text-center'>
                    <tr className='text-[15px] text-black'>
                      <th>ลำดับ</th>
                      <th>วัน</th>
                      <th>เวลา</th>
                      <th>จำนวนคาบ</th>
                      <th>ชื่อวิชา</th>
                      <th>ชื่ออาจารย์</th>
                    </tr>
                  </thead>
                  <tbody className='text-center'>
                    {getScheduleByClick.map((el, number) => (
                      <tr key={number} className="text-[15px]">
                        <th className="text-[15px]">{number + 1}</th>
                        <td className="text-[15px]">{el.sched_day}</td>
                        <td className="text-[15px]">{el.sched_time}</td>
                        <td className="text-[15px]">{el.sched_count}</td>
                        <td className="text-[15px]">{el.subject.sub_name}</td>
                        <td className="text-[15px]">{el.user.user_firstname} {el.user.user_lastname}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
            : <p className="text-xl font-semibold py-2 my-4 text-center">{`${!input.class_id && !input.sched_day ? "โปรดเลือกชั้นเรียนและวันที่ต้องการ" : "ไม่พบข้อมูลในระบบ"}`}</p>
          }

          {/* responsive */}

          <div className="block md:hidden">
            <div>
              {sortedSchedules.length !== 0 ?
                <div className="flex gap-2 flex-wrap justify-between mt-1 text-sm font-bold text-white sm:text-[13px]">
                  <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-yellow-400">
                    <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-yellow-400">วันจันทร์</p>
                    {sortedSchedules.filter(el => el.sched_day === "จันทร์").map((el, index) => (
                      <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                        <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                          <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                        </div>
                        <div className="my-1 text-center">
                          <div>
                            <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                            <p>จำนวน {el.sched_count} คาบ</p>
                          </div>
                          <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                        </div>
                        <div className="flex gap-1 justify-center">
                          <p>ห้อง {el.subject.room.room_name}</p>
                          <p>อาคาร {el.subject.room.build.build_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-pink-400">
                    <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-pink-400">วันอังคาร</p>
                    {sortedSchedules.filter(el => el.sched_day === "อังคาร").map((el, index) => (
                      <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                        <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                          <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                        </div>
                        <div className="my-1 text-center">
                          <div>
                            <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                            <p>จำนวน {el.sched_count} คาบ</p>
                          </div>
                          <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                        </div>
                        <div className="flex gap-1 justify-center">
                          <p>ห้อง {el.subject.room.room_name}</p>
                          <p>อาคาร {el.subject.room.build.build_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-green-400">
                    <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-green-400">วันพุธ</p>
                    {sortedSchedules.filter(el => el.sched_day === "พุธ").map((el, index) => (
                      <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                        <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                          <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                        </div>
                        <div className="my-1 text-center">
                          <div>
                            <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                            <p>จำนวน {el.sched_count} คาบ</p>
                          </div>
                          <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                        </div>
                        <div className="flex gap-1 justify-center">
                          <p>ห้อง {el.subject.room.room_name}</p>
                          <p>อาคาร {el.subject.room.build.build_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-orange-400">
                    <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-orange-400">วันพฤหัสบดี</p>
                    {sortedSchedules.filter(el => el.sched_day === "พฤหัสบดี").map((el, index) => (
                      <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                        <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                          <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                        </div>
                        <div className="my-1 text-center">
                          <div>
                            <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                            <p>จำนวน {el.sched_count} คาบ</p>
                          </div>
                          <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                        </div>
                        <div className="flex gap-1 justify-center">
                          <p>ห้อง {el.subject.room.room_name}</p>
                          <p>อาคาร {el.subject.room.build.build_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full sm:w-[49%] rounded-md p-1 pt-3 mt-2 relative border-2 border-blue-400">
                    <p className="text-lg font-bold absolute -top-3.5 left-2 bg-white px-2 text-blue-400">วันศุกร์</p>
                    {sortedSchedules.filter(el => el.sched_day === "ศุกร์").map((el, index) => (
                      <div className={`my-2 p-2 rounded-md bg-slate-800 pt-6 relative border-2 border-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)] ${index % 2 === 0 ? "bg-[#FF90B4]" : "bg-[#6096BC]"} `} key={index + 1}>
                        <div className="absolute bg-white top-0 left-0 w-[45%] h-6 pt-0.5 rounded-br-md">
                          <p className="text-center text-black font-extrabold">{el.sched_time}</p>
                        </div>
                        <div className="my-1 text-center">
                          <div>
                            <p className="text-[16px]">วิชา {el.subject.sub_name}</p>
                            <p>จำนวน {el.sched_count} คาบ</p>
                          </div>
                          <p>ครู {el.user.user_firstname} {el.user.user_lastname}</p>
                        </div>
                        <div className="flex gap-1 justify-center">
                          <p>ห้อง {el.subject.room.room_name}</p>
                          <p>อาคาร {el.subject.room.build.build_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                : ""
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
