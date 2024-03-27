import { useEffect, useState } from "react";

function TimeRealtime() {

    const [time, setTime] = useState([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().getTime());
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const time2 = new Date();

    const dayOfWeek = thaiDays[time2.getDay()];
    const dayOfMonth = time2.getDate();
    const month = thaiMonths[time2.getMonth()];
    const year = time2.getFullYear() + 543;

    const thaiDate = `วัน${dayOfWeek}ที่ ${dayOfMonth} เดือน ${month} พ.ศ. ${year} เวลา ${time.length !== 0 ? new Date(time).toLocaleTimeString('th-TH') : new Date().toLocaleTimeString('th-TH')} น.`;

    return thaiDate
}

export default TimeRealtime