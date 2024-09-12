
import { useEffect, useRef, useState } from 'react'
import axiosPath from "../../configs/axios-path";
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPrint } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/UseAuth';
import '../../print.css'
import { useNavigate } from 'react-router-dom';

export default function TableTeacher() {

  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const userID = location.pathname.split('/')[4];

  useEffect(() => {
    document.title = "Teacher | ดูตารางการสอน"
    setLoading(true)
    const getTable = async () => {
      let token = localStorage.getItem('token');
      const rs = await axiosPath.get(`/admin/teacher/schedule?userId=${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(rs.status === 200){
        setLoading(false)
        setSchedule(rs.data.getSchedule);
      }
    }
    getTable();
  }, [userID])

  document.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('keydown', e => e.keyCode === 123 ? e.preventDefault() : '');

  const componentRef = useRef();
  const hdlPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ตารางสอนของคุณครู ${user.user_firstname} ${user.user_lastname}`,
  });

  const year = new Date().getFullYear() + 543

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-5 min-h-[98vh]">
        <div className=' relative'>
          <span className=" absolute loading loading-ring loading-lg"></span>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
        <p className='text-white font-semibold text-lg'>กำลังโหลดข้อมูลตารางเรียน</p>
      </div>
    )
  }

  const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];

  const renderSchedule = (day, number) => (
    <div className="collapse collapse-arrow bg-base-200" key={number + 1}>
      <input type="radio" name={`my-accordion`} defaultChecked={day === "จันทร์"} />
      <div className="collapse-title flex items-center text-lg font-bold md:text-xl">วัน{day}</div>
      <div className="collapse-content px-6">
        {schedule.filter(el => el.sched_day === day).map((el, index) => (
          <div className="border my-2 rounded-lg shadow-md p-2" key={index + 1}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm">เวลา</p>
                <p className='text-sm'>{el.sched_time}</p>
              </div>
              <div className="text-xs">
                <p>จำนวน {el.sched_count} ชั่วโมง</p>
              </div>
            </div>
            <div className="flex justify-between my-2">
              <p className="text-md font-bold">วิชา {el.subject.sub_name}</p>
              <p className="text-md font-bold">รหัสวิชา {el.subject.sub_code}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>คุณครู {el.user.user_firstname} {el.user.user_lastname}</p>
              <p>{el.user.user_phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='max-w-[80rem] mx-auto select-none'>
      <table className='mt-6 w-full text-white text-center table-spacing font-bold scale-90 table-class' ref={componentRef}>
        <thead className='h-16 border-2'>
          <tr className=''>
            <th colSpan={9} className='text-xl'>ตารางการเรียนการสอนของคุณครู {schedule[0]?.user?.user_firstname} {schedule[0]?.user?.user_lastname} ประจำปี พ.ศ. {year}</th>
          </tr>
          <tr className='rounded-lg'>
            <th id='time' className='rounded-lg border-0 bg-slate-600 w-32 text-xl' rowSpan={2}>วัน / เวลา</th>
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
            <td className='rounded-lg bg-[#FF90BC] border-0 text-xl'>จันทร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "จันทร์" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "09:30-10:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "10:30-11:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
              console.log(scheduleItem)
              return (
                <td key={index} className='rounded-lg border-2 border-[#6096B4]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.class.class_name} <br />
                      {scheduleItem.subject.room.room_name} <br />
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#FF90BC] border-0 text-xl'>อังคาร</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "อังคาร" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "09:30-10:30" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "10:30-11:30" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#6096B4]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.class.class_name} <br />
                      {scheduleItem.subject.room.room_name} <br />
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#FF90BC] border-0 text-xl'>พุธ</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "พุธ" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "09:30-10:30" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "10:30-11:30" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#6096B4]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.class.class_name} <br />
                      {scheduleItem.subject.room.room_name} <br />
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg bg-[#FF90BC] border-0 text-xl'>พฤหัสบดี</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "พฤหัสบดี" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "09:30-10:30" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "10:30-11:30" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#6096B4]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.class.class_name} <br />
                      {scheduleItem.subject.room.room_name} <br />
                    </>
                  )}
                </td>
              );
            })}
          </tr>
          <tr className='h-20'>
            <td className='rounded-lg border-2 bg-[#FF90BC] dark:border-0 text-xl'>ศุกร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "ศุกร์" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "09:30-10:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "10:30-11:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-[#6096B4]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
                  {scheduleItem && (
                    <>
                      {scheduleItem.subject.sub_name} <br />
                      {scheduleItem.class.class_name} <br />
                      {scheduleItem.subject.room.room_name} <br />
                    </>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      <div className='flex justify-between px-20'>
        <button className='font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white flex items-center gap-1 hover:gap-2 active:gap-2' onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} /> ย้อนกลับ</button>
        <button className='font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white' onClick={hdlPrint} ><FontAwesomeIcon icon={faPrint} /> ปริ้นตารางเรียน</button>
      </div>

      {/* responsive */}
      <div data-theme="light" className='2xl:hidden flex gap-2 flex-col bg-transparent mt-20 my-10 px-4'>
        <p className='text-white text-center font-semibold text-md md:text-lg my-2'>ข้อมูลตารางเรียน {user.class.class_name}</p>
        {days.map((day, index) => renderSchedule(day, index))}
      </div>
    </div>
  )
}

