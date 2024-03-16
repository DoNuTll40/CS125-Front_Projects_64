
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
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

  useEffect(() => {
    document.title = "Teacher | Schedule"
    const getTable = async () => {
      let token = localStorage.getItem('token');
      const rs = await axios.get('http://localhost:8000/admin/teacher/schedule', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSchedule(rs.data.getSchedule);
    }
    getTable();
  }, [])

  document.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('keydown', e => e.keyCode === 123 ? e.preventDefault() : '');

  const componentRef = useRef();
  const hdlPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ตารางสอนของคุณครู ${user.user_firstname} ${user.user_lastname}`,
  });

  return (
    <div className='max-w-[80rem] mx-auto select-none'>
      <table className='mt-6 w-full text-black dark:text-white text-center table-spacing font-bold scale-90' ref={componentRef}>
        <thead className='h-16 border-2'>
          <tr className=''>
            <th colSpan={9} className='text-xl'>ตารางการเรียนการสอนของคุณครู {user.user_firstname} {user.user_lastname}</th>
          </tr>
          <tr className='rounded-lg'>
            <th className='rounded-lg border-2 border-black dark:border-0 dark:bg-slate-600 w-32 text-2xl' rowSpan={2}>วัน</th>
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
            <td className='rounded-lg border-2 border-black dark:bg-[#FF90BC] dark:border-0 text-xl'>จันทร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "จันทร์" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "พัก" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-black dark:border-[#FF90BC]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
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
            <td className='rounded-lg border-2 border-black dark:bg-[#FF90BC] dark:border-0 text-xl'>อังคาร</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "อังคาร" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "อังคาร" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-black dark:border-[#FF90BC]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
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
            <td className='rounded-lg border-2 border-black dark:bg-[#FF90BC] dark:border-0 text-xl'>พุธ</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "พุธ" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "พุธ" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-black dark:border-[#FF90BC]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
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
            <td className='rounded-lg border-2 border-black dark:bg-[#6096B4] dark:border-0 text-xl'>พฤหัสบดี</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "พฤหัสบดี" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "พฤหัสบดี" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-black dark:border-[#6096B4]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
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
            <td className='rounded-lg border-2 border-black dark:bg-[#6096B4] dark:border-0 text-xl'>ศุกร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "ศุกร์" && el.sched_time === time);
              const shouldRemoveBreak = time === "พัก" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              if (shouldRemoveBreak || shouldRemoveBreak2) return null;
              return (
                <td key={index} className='rounded-lg border-2 border-black dark:border-[#6096B4]' colSpan={scheduleItem ? scheduleItem.sched_count : 1}>
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
      <div className='flex justify-between px-20 mt-[-15px]'>
        <button className='font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white flex items-center gap-1 hover:gap-2 active:gap-2' onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} /> ย้อนกลับ</button>
        <button className='font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white' onClick={hdlPrint} ><FontAwesomeIcon icon={faPrint} /> ปริ้นตารางเรียน</button>
      </div>
    </div>
  )
}

