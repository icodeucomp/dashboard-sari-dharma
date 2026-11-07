"use client";

import { useState } from "react";
import { useDoctorOptions, useSpecialistOptions } from "@/app/hooks/useOptions";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiUpload } from "@mdi/js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "moment/locale/id";
import { createDoctorSchedule, getDoctorList, getSpecialistList } from "@/app/services/doctorScheduleService";
import AsyncSelect from "react-select/async";

export default function AddDoctorSchedule() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createDoctorSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-schedules"] });
      router.push("/dashboard/doctor-schedules");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan jadwal dokter"),
  });
  const loading = saveMutation.isPending;

  const [selectedDoctor, setSelectedDoctor] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [selectedSpecialist, setSelectedSpecialist] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const loadDoctorOptions = async (inputValue: string) => {
    try {
      const res = await getDoctorList(inputValue.toLowerCase());
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((doctor) => ({
          value: doctor.id,
          label: doctor.name,
        }));
      }
      return [];
    } catch {
      return [];
    }
  };

  const loadSpecialistOptions = async (inputValue: string) => {
    try {
      const res = await getSpecialistList();
      if (res.success && Array.isArray(res.data)) {
        return res.data
          .filter((specialist) => specialist.name.toLowerCase().includes(inputValue.toLowerCase()))
          .map((specialist) => ({
            value: specialist.id,
            label: specialist.name,
          }));
      }
      return [];
    } catch {
      return [];
    }
  };
  const [doctorBackground, setDoctorBackground] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [schedule, setSchedule] = useState([{ day: "", start_time: "", end_time: "" }]);
  const [educationCareer, setEducationCareer] = useState([{ title: "", start_year: "", end_year: "" }]);
  const [error, setError] = useState("");

  const { options: doctorOptions, isLoading: loadingDoctor } = useDoctorOptions();
  const { options: specialistOptions, isLoading: loadingSpecialist } = useSpecialistOptions();
  const loadingDropdown = loadingDoctor || loadingSpecialist;

  const handleAddSchedule = () => {
    setSchedule([...schedule, { day: "", start_time: "", end_time: "" }]);
  };

  const handleDeleteSchedule = (index: number) => {
    if (schedule.length > 1) {
      setSchedule(schedule.filter((_, i) => i !== index));
    } else {
      setError("Minimal harus ada satu jadwal");
    }
  };

  const handleChangeSchedule = (index: number, field: "day" | "start_time" | "end_time", value: string) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  const handleAddEducationCareer = () => {
    setEducationCareer([...educationCareer, { title: "", start_year: "", end_year: "" }]);
  };

  const handleDeleteEducationCareer = (index: number) => {
    if (educationCareer.length > 1) {
      setEducationCareer(educationCareer.filter((_, i) => i !== index));
    } else {
      setError("Minimal harus ada satu edukasi/karir");
    }
  };

  const handleChangeEducationCareer = (index: number, field: "title" | "start_year" | "end_year", value: string) => {
    const updatedEducationCareer = [...educationCareer];
    updatedEducationCareer[index][field] = value;
    setEducationCareer(updatedEducationCareer);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleResetForm = () => {
    setSelectedDoctor({ value: "", label: "" });
    setSelectedSpecialist({ value: "", label: "" });
    setDoctorBackground("");
    setPhoto(null);
    setSchedule([{ day: "", start_time: "", end_time: "" }]);
    setEducationCareer([{ title: "", start_year: "", end_year: "" }]);
    setError("");
  };

  const validateForm = () => {
    if (!selectedDoctor.value) {
      setError("Dokter harus dipilih");
      return false;
    }

    if (!selectedSpecialist.value) {
      setError("Spesialis harus dipilih");
      return false;
    }

    for (const item of schedule) {
      if (!item.day || !item.start_time || !item.end_time) {
        setError("Semua jadwal harus diisi lengkap");
        return false;
      }
    }

    for (const item of educationCareer) {
      if (!item.title || !item.start_year) {
        setError("Judul dan tahun mulai edukasi/karir harus diisi");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");

      const formData = new FormData();
      formData.append("doctor_id", selectedDoctor.value);
      formData.append("specialist_id", selectedSpecialist.value);

      if (doctorBackground) {
        formData.append("doctor_background", doctorBackground);
      }

      if (photo) {
        formData.append("photo", photo);
      }

      formData.append("schedule", JSON.stringify(schedule));
      formData.append("education_career", JSON.stringify(educationCareer));

      saveMutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Jadwal Dokter Baru</h1>
        <Link href="/dashboard/doctor-schedules" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md">
          Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">Upload Foto</label>
          <div className="flex items-center flex-1">
            <label
              htmlFor="photo"
              className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </label>
            <input id="photo" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">{photo ? photo.name : "max. 2mb"}</span>
          </div>
        </div>
        <div className="mb-6 flex items-center">
          <label htmlFor="doctor" className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Dokter <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <AsyncSelect
              cacheOptions
              defaultOptions={doctorOptions}
              loadOptions={loadDoctorOptions}
              inputId="doctor"
              classNamePrefix="react-select"
              isSearchable
              isClearable
              isDisabled={loading || loadingDropdown}
              placeholder="Pilih Dokter..."
              value={selectedDoctor.value ? selectedDoctor : null}
              onChange={(option) => {
                setSelectedDoctor(option ? { value: option.value, label: option.label } : { value: "", label: "" });
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 42,
                }),
                menu: (base) => ({ ...base, zIndex: 20 }),
              }}
              required
            />
          </div>
        </div>
        <div className="mb-6 flex items-center">
          <label htmlFor="specialist" className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Spesialis <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <AsyncSelect
              cacheOptions
              defaultOptions={specialistOptions}
              loadOptions={loadSpecialistOptions}
              inputId="specialist"
              classNamePrefix="react-select"
              isSearchable
              isClearable
              isDisabled={loading || loadingDropdown}
              placeholder="Pilih Spesialis..."
              value={selectedSpecialist.value ? selectedSpecialist : null}
              onChange={(option) => {
                setSelectedSpecialist(option ? { value: option.value, label: option.label } : { value: "", label: "" });
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 42,
                }),
                menu: (base) => ({ ...base, zIndex: 20 }),
              }}
              required
            />
          </div>
        </div>

        <div className="mb-6 flex">
          <label htmlFor="doctorBackground" className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2">
            Background Dokter
          </label>
          <textarea
            id="doctorBackground"
            value={doctorBackground}
            onChange={(e) => setDoctorBackground(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="Masukkan background dokter"
            disabled={loading}
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Jadwal Dokter</label>

          {schedule.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex flex-col w-1/3">
                <label className="text-xs text-gray-500 mb-1">Hari</label>
                <select
                  value={item.day}
                  onChange={(e) => handleChangeSchedule(index, "day", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                >
                  <option value="">Pilih Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </select>
              </div>

              <div className="flex flex-col w-1/4">
                <label className="text-xs text-gray-500 mb-1">Jam Mulai</label>
                <input
                  type="time"
                  value={item.start_time}
                  onChange={(e) => handleChangeSchedule(index, "start_time", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-1/4">
                <label className="text-xs text-gray-500 mb-1">Jam Selesai</label>
                <input
                  type="time"
                  value={item.end_time}
                  onChange={(e) => handleChangeSchedule(index, "end_time", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSchedule(index)}
                disabled={loading}
                className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md mt-5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSchedule}
            disabled={loading}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tambah Hari
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Edukasi / Karir</label>

          {educationCareer.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex flex-col w-1/2">
                <label className="text-xs text-gray-500 mb-1">Pendidikan</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleChangeEducationCareer(index, "title", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Judul Edukasi / Karir"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col w-1/5">
                <label className="text-xs text-gray-500 mb-1">Tahun Mulai</label>
                <input
                  type="number"
                  value={item.start_year}
                  onChange={(e) => handleChangeEducationCareer(index, "start_year", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tahun Mulai"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-1/5">
                <label className="text-xs text-gray-500 mb-1">Tahun Selesai</label>
                <input
                  type="number"
                  value={item.end_year}
                  onChange={(e) => handleChangeEducationCareer(index, "end_year", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tahun Selesai"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteEducationCareer(index)}
                disabled={loading}
                className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md mt-5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEducationCareer}
            disabled={loading}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tambah Baru
          </button>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={loading}
            className={`font-medium py-2 px-6 rounded-md ${
              loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            }`}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`font-medium py-2 px-6 rounded-md ${loading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 text-white"}`}
          >
            {loading ? "Saving..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
