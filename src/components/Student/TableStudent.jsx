
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function TableStudent() {

  const [schedule, setSchedule] = useState([]);
  const [cView, setCView] = useState([])
  const sched_count = 2;

  useEffect(() => {
    document.title = "Schedule"
    const getTable = async () => {
      let token = localStorage.getItem('token');
      const rs = await axios.get('http://10.90.0.20:8000/user/table', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSchedule(rs.data.schedule);
    }
    getTable();
    if (cView.length === 0) {
      const getTableById = async () => {
        let token = localStorage.getItem('token');
        const rs = await axios.get(`http://10.90.0.20:8000/user/table/1`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCView(rs.data.schedule);
      }
      getTableById();
    }
  }, [])

  const hdlClick = (id) => {
    const getTable = async () => {
      let token = localStorage.getItem('token');
      const rs = await axios.get(`http://10.90.0.20:8000/user/table/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCView(rs.data.schedule);
      document.getElementById('my_modal_3').showModal()
    }
    getTable();
    console.log(cView)
  }

  return (
    <div className='max-w-[80rem] mx-auto select-none mt-16'>
      <table className='mt-10 w-full text-white text-center table-spacing font-bold scale-90'>
        <thead className='h-16 border-2'>
          <tr className='rounded-lg'>
            <th className='rounded-lg bg-slate-600 w-32 text-2xl' rowSpan={2}>วัน</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th className='w-32'>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
          </tr>
          <tr>
            <th>08:30-09:30</th>
            <th>09:30-10:30</th>
            <th>10:30-11:30</th>
            <th>11-30-12:30</th>
            <th>พัก</th>
            <th>13:30-14:30</th>
            <th>14:30-15:30</th>
            <th>15:30-16:30</th>
          </tr>
        </thead>
        <tbody>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#FF90BC] text-xl'>จันทร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "จันทร์" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#FF90BC] scale-100 transition ease-in-out hover:cursor-pointer active:scale-95' colSpan={scheduleItem ? scheduleItem.sched_count : 1} onClick={() => scheduleItem && hdlClick(scheduleItem.sched_id)}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_code} <br />
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.user.user_firstname}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#FF90BC] text-xl'>อังคาร</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "อังคาร" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#FF90BC] scale-100 transition ease-in-out hover:cursor-pointer active:scale-95' colSpan={scheduleItem ? scheduleItem.sched_count : 1} onClick={() => scheduleItem && hdlClick(scheduleItem.sched_id)}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_code} <br />
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.user.user_firstname}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#FF90BC] text-xl'>พุธ</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "พุธ" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#FF90BC] scale-100 transition ease-in-out hover:cursor-pointer active:scale-95' colSpan={scheduleItem ? scheduleItem.sched_count : 1} onClick={() => scheduleItem && hdlClick(scheduleItem.sched_id)}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_code} <br />
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.user.user_firstname}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#6096B4] text-xl'>พฤหัสบดี</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "พฤหัสบดี" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#6096B4] scale-100 transition ease-in-out hover:cursor-pointer active:scale-95' colSpan={scheduleItem ? scheduleItem.sched_count : 1} onClick={() => scheduleItem && hdlClick(scheduleItem.sched_id)}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_code} <br />
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.user.user_firstname}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#6096B4] text-xl'>ศุกร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "ศุกร์" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#6096B4] scale-100 transition ease-in-out hover:cursor-pointer active:scale-95' colSpan={scheduleItem ? scheduleItem.sched_count : 1} onClick={() => scheduleItem && hdlClick(scheduleItem.sched_id)}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_code} <br />
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.user.user_firstname}
                    </>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      {cView.length !== 0 && (
        <dialog data-theme="light" id="my_modal_3" className="modal select-none">
          <div className="modal-box px-0 py-0">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute text-[#FF90BC] hover:bg-[#6096B4] hover:text-white right-2 top-2">✕</button>
            </form>
            <p className='text-xl text-white border-2 border-white backdrop-blur-sm w-[300px] font-bold absolute right-[21rem] top-[14rem] h-8 flex items-center justify-end px-4 text-right rounded-full bg-white/30'>อาคาร {cView.subject.room.build.build_name === "โดรมอเนกประสงค์" ? "โดม" : cView.subject.room.build.build_name}</p>
            <img className='pointer-events-none' src={cView.subject.room.build.build_image} alt="" />
            <p className="text-lg  text-black font-bold mt-2 px-2"><b>- ข้อมูลวิชา</b></p>
            <div className='px-4 text-black flex justify-between'>
              <h3 className="text-lg"><b>วิชา :</b> {cView.subject.sub_name}</h3>
              <p className="text-lg"><b>รหัสวิชา :</b> {cView.subject.sub_code}</p>
            </div>
            <p className="text-lg  text-black font-bold px-2"><b>- ข้อมูลอาจารย์</b></p>
            <div className='px-4 text-black flex justify-between'>
              <h3 className="text-md"><b>อาจารย์ :</b> {cView.user.user_firstname}</h3>
              <p className="text-md"><b>นามสกุล :</b> {cView.user.user_lastname}</p>
              <p className="text-md"><b>เบอร์ติดต่อ :</b> {cView.user.user_phone}</p>
            </div>
            <p className="text-lg  text-black font-bold px-2"><b>- ข้อมูลอาคาร</b></p>
            <div className='px-4 mb-2 text-black flex justify-between'>
              <h3 className="text-md"><b>ห้องเรียน :</b> {cView.subject.room.room_name}</h3>
              <p className="text-md"><b>อาคาร :</b> {cView.subject.room.build.build_name}</p>
            </div>
          </div>
        </dialog>)}
    </div>
  )
}

