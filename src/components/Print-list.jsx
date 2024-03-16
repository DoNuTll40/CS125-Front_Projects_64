
import { PDFViewer, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import useAuth from '../hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SarabunBold from '../assets/font/Sarabun-Bold.ttf'
import Sarabun from '../assets/font/Sarabun-Regular.ttf'

export default function Printlist() {

    const { fullStudent } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (fullStudent.length === 0) {
            alert('ระบบไม่พบข้อมูลโปรดลองใหม่อีกครั้ง')
            navigate('/');
        }
    }, [fullStudent, navigate]);

    const classRoom = fullStudent.length > 0 ? fullStudent[0].class.class_name : "ไม่มีข้อมูล";

    document.title = "ปริ้นรายชื่อนักเรียน ชั้น " + classRoom

    const gender = fullStudent.filter(el => el.user_nameprefix === "เด็กชาย" || el.user_nameprefix === "นาย").length
    const woman = fullStudent.filter(el => el.user_nameprefix === "เด็กหญิง" || el.user_nameprefix === "นางสาว" || el.user_nameprefix === "นาง").length
    const emptyRows = new Array(5).fill({});
    const studentData = fullStudent.concat(emptyRows);

    return (
        <PDFViewer style={{ width: '100%', height: '800px' }}>
            <Document title={`ใบรายชื่อนักเรียนชั้น ${classRoom}`} producer='FB : Nuttawut_Chawna' author='โรงเรียน มัธยมรังศรีวิทยาแบ่งปัน สังกัดสํานักงานเขตพื้นที่การมัธยมศึกษา เขตที่ 3'>
                <Page size="A4" style={styles.page}>
                    <Text style={styles.title}>ใบรายชื่อนักเรียนชั้น {classRoom} ประจำภาคเรียนที่ ... ปีการศึกษา ....</Text>
                    <Text style={styles.titleSecond}>โรงเรียน มัธยมรังศรีวิทยาแบ่งปัน สังกัดสํานักงานเขตพื้นที่การมัธยมศึกษา เขตที่ 3 </Text>
                    <View style={styles.table}>
                        <View style={styles.section}>
                            {/* Header Row */}
                            <View style={[styles.row, styles.headerRow]}>
                                <Text style={[styles.cellNumber, styles.headerCell]}>ลำดับที่่</Text>
                                <Text style={[styles.cellName, styles.headerCell]}>ชื่อ - นามสกุล</Text>
                                <Text style={[styles.cellNick, styles.headerCell]}>ชื่อเล่น</Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cell, styles.headerCell]}></Text>
                                <Text style={[styles.cellDetail, styles.headerCell]}>หมายเหตุ</Text>
                            </View>
                            {/* Data Rows */}
                            {fullStudent.length !== 0 ? (
                                studentData.map((user, index) => (
                                    <View key={index} style={styles.rowBody}>
                                        <Text style={styles.cellNumber}>{index + 1}</Text>
                                        <Text style={styles.cellName}>{user.user_nameprefix} {user.user_firstname} {user.user_lastname}</Text>
                                        <Text style={styles.cellNick}>{user.user_nickname}</Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cell}></Text>
                                        <Text style={styles.cellDetail}></Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>ไม่มีข้อมูล</Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.low}>
                        <Text style={styles.lowTitle}>เด็กผู้ชายทั้งหมด {gender} คน</Text>
                        <Text style={styles.lowTitle}>เด็กผู้หญิงทั้งหมด {woman} คน</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}

// Font register
Font.register({
    family: 'Sarabun',
    src: Sarabun,
});

Font.register({
    family: 'Sarabun-Bold',
    src: SarabunBold,
});

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        fontFamily: 'Sarabun',
        fontSize: '10px'
    },
    title: {
        marginTop: 50,
        textAlign: 'center',
        fontFamily: 'Sarabun-Bold'
    },
    titleSecond: {
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Sarabun-Bold'
    },
    table: {
        flexDirection: 'row',
    },
    section: {
        margin: 10,
        padding: 50,
        paddingTop: 10,
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 0
    },
    rowBody: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000000',
        padding: 0
    },
    cellNumber: {
        flex: 0.4,
        textAlign: 'center',
        borderRightWidth: 1,
        borderBottomColor: '#000000',
        padding: 2
    },
    cellName: {
        flex: 2,
        textAlign: 'left',
        borderRightWidth: 1,
        borderBottomColor: '#000000',
        padding: 2,
        paddingLeft: 4,
        paddingRight: 0,
    },
    cellNick: {
        flex: 0.5,
        textAlign: 'left',
        borderRightWidth: 1,
        borderBottomColor: '#000000',
        padding: 2,
        paddingLeft: 4,
        paddingRight: 0,
    },
    cellDetail: {
        flex: 0.7,
        textAlign: 'left',
        borderRightWidth: 1,
        borderBottomColor: '#000000',
        padding: 2,
        paddingLeft: 4,
        paddingRight: 0,
    },
    cell: {
        flex: 0.2,
        textAlign: 'left',
        borderRightWidth: 1,
        borderBottomColor: '#000000',
        padding: 2
    },
    headerCell: {
        fontFamily: 'Sarabun-Bold',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4,
    },
    low: {
        margin: 10,
        paddingLeft: 50,
        gap: 10
    },
    lowTitle: {
        fontFamily: 'Sarabun-Bold',
        fontSize: 10
    }
});
