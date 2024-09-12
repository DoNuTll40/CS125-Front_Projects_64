/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react'
import axiosPath from "../../configs/axios-path";
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/UseAuth';
import '../../print.css'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Swal from 'sweetalert2';

export default function TableStudent() {

  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [cView, setCView] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    document.title = `ตารางเรียนของ ${user.user_nameprefix} ${user.user_firstname} ${user.user_lastname}`

    const getTable = async () => {
      let token = localStorage.getItem('token');
      const rs = await axiosPath.get('/user/table', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (rs.status === 200) {
        setSchedule(rs.data.schedule);
        setLoading(false)
      }
    }
    getTable();
    if (cView.length === 0) {
      const getTableById = async () => {
        let token = localStorage.getItem('token');
        const rs = await axiosPath.get(`/user/table/1`, {
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
    Swal.fire({
      title: 'กำลังโหลดข้อมูล...',
      text: 'ระบบกำลังโหลดข้อมูลโปรดรอสักครู่!',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const getTable = async () => {
      let token = localStorage.getItem('token');
      const rs = await axiosPath.get(`/user/table/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCView(rs.data.schedule);
      Swal.close()
      document.getElementById('my_modal_3').showModal()
    }
    getTable();
  }

  document.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('keydown', e => e.keyCode === 123 ? e.preventDefault() : '');

  const componentRef = useRef();

  const hdlPrint = useReactToPrint({
    content: () => {
        console.log('Preparing to print...'); // ตรวจสอบว่าเรียกใช้งาน
        return componentRef.current;
    },
    documentTitle: `ตารางเรียนชั้น ${user.class.class_name}`,
});

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
    <div data-theme="dark" className='max-w-[80rem] mx-auto select-none'>
      <table className='mt-4 w-full text-white text-center table-spacing font-bold scale-90 hidden 2xl:block table-class' ref={componentRef}>
        <thead>
          <tr>
            <th colSpan={9} className='text-xl'>ตารางเรียนชั้น {user.class.class_name}</th>
          </tr>
          <tr className='rounded-lg'>
            <th id='time' className='rounded-lg border-black border-0 bg-slate-600 w-32 text-xl' rowSpan={2}>วัน / เวลา</th>
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
            <td className='rounded-lg border-black bg-[#FF90BC] border-0 text-xl'>จันทร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "จันทร์" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "09:30-10:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "10:30-11:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "จันทร์" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
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
            <td className='rounded-lg bg-[#FF90BC] border-0 text-xl'>ศุกร์</td>
            {["08:30-09:30", "09:30-10:30", "10:30-11:30", "11:30-12:30", "พัก", "13:30-14:30", "14:30-15:30", "15:30-16:30"].map((time, index) => {
              const scheduleItem = schedule.find(el => el.sched_day === "ศุกร์" && el.sched_time === time);
              const shouldRemoveBreak1 = time === "09:30-10:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "08:30-09:30" && el.sched_count === 2);
              const shouldRemoveBreak2 = time === "10:30-11:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "09:30-10:30" && el.sched_count === 2);
              const shouldRemoveBreak3 = time === "11:30-12:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "10:30-11:30" && el.sched_count === 2);
              const shouldRemoveBreak4 = time === "14:30-15:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "13:30-14:30" && el.sched_count === 2);
              const shouldRemoveBreak5 = time === "15:30-16:30" && schedule.some(el => el.sched_day === "ศุกร์" && el.sched_time === "14:30-15:30" && el.sched_count === 2);
              if (shouldRemoveBreak1 || shouldRemoveBreak2 || shouldRemoveBreak3 || shouldRemoveBreak4 || shouldRemoveBreak5) return null;
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
      <div className='justify-end px-20 mt-0 2xl:flex hidden'>
        <button className='font-semibold shadow-md bg-transparent text-[#6096B4] py-1.5 px-4 rounded-full mb-3 scale-100 transition ease-in-out border-2 border-[#6096B4] active:scale-95 active:bg-[#FF90BC] active:border-[#FF90BC] active:text-white active:font-bold hover:font-bold hover:bg-[#FF90BC] hover:border-[#FF90BC] hover:text-white' onClick={hdlPrint} ><FontAwesomeIcon icon={faPrint} /> ปริ้นตารางเรียน</button>
      </div>
      {cView.length !== 0 && (
        <dialog data-theme="light" id="my_modal_3" className="modal select-none backdrop-blur-sm">
          <div className="modal-box px-0 py-0 shadow-lg">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute z-50 text-[#FF90BC] hover:bg-[#6096B4] hover:text-white right-2 top-2">✕</button>
            </form>
            <div className='max-h-[275px] relative overflow-hidden'>
              <Swiper navigation={true} loop pagination={{ dynamicBullets: true }} modules={[Navigation, Pagination]}>
                <SwiperSlide>
                  <p className='text-xl text-white border-2 border-white backdrop-blur-sm w-[300px] font-bold absolute right-[21rem] top-[14rem] h-8 flex items-center justify-end px-4 text-right rounded-full bg-white/30'>อาคาร {cView.subject.room.build.build_name === "โดรมอเนกประสงค์" ? "โดม" : cView.subject.room.build.build_name}</p>
                  <img className='pointer-events-none mx-auto max-h-[275px]' src={cView.subject.room.build.build_image} alt="" />
                </SwiperSlide>
                <SwiperSlide>
                  <p className={`text-xl border-2 border-white backdrop-blur-sm w-[150px] font-bold absolute right-[21rem] z-30 top-[2rem] h-8 flex items-center justify-end px-4 text-right rounded-full bg-white/30 ${cView.user.user_nameprefix === "นาย" ? "text-sky-950" : "text-[#FF90BC]"}`}>คุณครูผู้สอน</p>
                  <div className=' relative'>
                    <img className='pointer-events-none mx-auto max-h-[275px] relative z-20 shadow-md border-2 rounded-md border-white' src={cView.user.user_image} alt="" />
                    <img className='pointer-events-none absolute top-0 left-0 w-full h-full z-0 blur-sm' src={cView.user.user_image} alt="" />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            <p className="text-lg  text-black font-bold mt-2 px-2"><b>- ข้อมูลวิชา</b></p>
            <div className='px-4 text-black flex justify-between'>
              <h3 className="text-lg"><b>วิชา :</b> {cView.subject.sub_name}</h3>
              <p className="text-lg"><b>รหัสวิชา :</b> {cView.subject.sub_code}</p>
            </div>
            <p className="text-lg  text-black font-bold px-2"><b>- ข้อมูลอาจารย์</b></p>
            <div className='px-4 text-black flex justify-between'>
              <h3 className="text-md"><b>คุณครู :</b> {cView.user.user_firstname}</h3>
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

      {/* responsive */}
      <div data-theme="light" className='2xl:hidden flex gap-2 flex-col bg-transparent mt-20 my-10 px-4'>
        <p className='text-white text-center font-semibold text-md md:text-lg my-2'>ข้อมูลตารางเรียน {user.class.class_name}</p>
        {days.map((day, index) => renderSchedule(day, index))}
      </div>

    </div>
  )
}

