"use client";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { 
  mdiAccountGroup, 
  mdiCalendarClock, 
  mdiCashRegister, 
  mdiMedicalBag,
  mdiCalendarToday
} from "@mdi/js";
import moment from "moment";

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

const DashboardCard = ({ title, value, icon, color }: DashboardCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} text-white mr-4`}>
        <Icon path={icon} size={1.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState("");
  
  useEffect(() => {
    // Set formatted current date
    setCurrentDate(moment().format("dddd, D MMMM YYYY"));
  }, []);

  // Recent patients data (sample)
  const recentPatients = [
    { id: "P001", name: "Budi Santoso", date: "2023-06-15", status: "Selesai" },
    { id: "P002", name: "Siti Rahayu", date: "2023-06-15", status: "Dalam Antrian" },
    { id: "P003", name: "Eko Prasetyo", date: "2023-06-15", status: "Konsultasi" },
    { id: "P004", name: "Dewi Lestari", date: "2023-06-14", status: "Selesai" },
    { id: "P005", name: "Ahmad Hidayat", date: "2023-06-14", status: "Selesai" },
  ];

  // Today's appointments (sample)
  const todayAppointments = [
    { time: "08:00", patient: "Budi Santoso", doctor: "dr. Andi", status: "Selesai" },
    { time: "09:00", patient: "Siti Rahayu", doctor: "dr. Andi", status: "Dalam Antrian" },
    { time: "09:30", patient: "Eko Prasetyo", doctor: "dr. Maya", status: "Konsultasi" },
    { time: "10:00", patient: "Nina Agustina", doctor: "dr. Maya", status: "Terjadwal" },
    { time: "11:00", patient: "Rudi Hartono", doctor: "dr. Andi", status: "Terjadwal" },
  ];

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          <Icon path={mdiCalendarToday} size={0.8} className="inline mr-1" />
          {currentDate}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard 
          title="Total Pasien" 
          value={1243} 
          icon={mdiAccountGroup} 
          color="bg-blue-600" 
        />
        <DashboardCard 
          title="Antrian Hari Ini" 
          value={15} 
          icon={mdiCalendarClock} 
          color="bg-green-600" 
        />
        <DashboardCard 
          title="Pendapatan Hari Ini" 
          value="Rp 2.500.000" 
          icon={mdiCashRegister} 
          color="bg-yellow-600" 
        />
        <DashboardCard 
          title="Konsultasi Selesai" 
          value={8} 
          icon={mdiMedicalBag} 
          color="bg-purple-600" 
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pasien Terbaru</h2>
            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentPatients.map((patient, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {patient.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {patient.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {moment(patient.date).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${patient.status === 'Selesai' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : patient.status === 'Dalam Antrian'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Jadwal Hari Ini</h2>
            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pasien
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dokter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {todayAppointments.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {appointment.time}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {appointment.patient}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {appointment.doctor}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'Selesai' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : appointment.status === 'Dalam Antrian'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : appointment.status === 'Konsultasi'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
