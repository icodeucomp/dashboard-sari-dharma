"use client";

import { useState } from "react";
import { useDoctorOptions, useSpecialistOptions } from "@/app/hooks/useOptions";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete } from "@mdi/js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "moment/locale/id";
import { createDoctorSchedule, getDoctorList, getSpecialistList } from "@/app/services/doctorScheduleService";
import AsyncSelect from "react-select/async";
import { PageHeader } from "@/app/components/ui";

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

  const handleResetForm = () => {
    setSelectedDoctor({ value: "", label: "" });
    setSelectedSpecialist({ value: "", label: "" });
    setDoctorBackground("");
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

      formData.append("schedule", JSON.stringify(schedule));
      formData.append("education_career", JSON.stringify(educationCareer));

      saveMutation.mutate(formData);
  };

  return (
    <div className="page">
      <PageHeader title="Tambah Jadwal Dokter Baru" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/doctor-schedules" />

      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="alert-error">{error}</div>}
        <p className="alert-info">
          Foto dokter diatur di menu{" "}
          <Link href="/dashboard/doctors" className="font-semibold underline">
            Master Dokter
          </Link>
          . Di sini cukup pilih dokternya.
        </p>
        <div className="form-row">
          <label htmlFor="doctor" className="form-label">
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
        <div className="form-row">
          <label htmlFor="specialist" className="form-label">
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

        <div className="form-row-top">
          <label htmlFor="doctorBackground" className="form-label md:pt-2">
            Background Dokter
          </label>
          <textarea
            id="doctorBackground"
            value={doctorBackground}
            onChange={(e) => setDoctorBackground(e.target.value)}
            className="form-input"
            rows={4}
            placeholder="Masukkan background dokter"
            disabled={loading}
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Jadwal Dokter</label>

          {schedule.map((item, index) => (
            <div key={index} className="flex flex-wrap items-end gap-3 mb-4 sm:gap-4">
              <div className="flex flex-col w-full sm:w-1/3">
                <label className="text-xs text-gray-500 mb-1">Hari</label>
                <select
                  value={item.day}
                  onChange={(e) => handleChangeSchedule(index, "day", e.target.value)}
                  className="form-input"
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

              <div className="flex flex-col w-[calc(50%-0.375rem)] sm:w-1/4">
                <label className="text-xs text-gray-500 mb-1">Jam Mulai</label>
                <input
                  type="time"
                  value={item.start_time}
                  onChange={(e) => handleChangeSchedule(index, "start_time", e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-[calc(50%-0.375rem)] sm:w-1/4">
                <label className="text-xs text-gray-500 mb-1">Jam Selesai</label>
                <input
                  type="time"
                  value={item.end_time}
                  onChange={(e) => handleChangeSchedule(index, "end_time", e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteSchedule(index)}
                disabled={loading}
                className={`btn btn-danger btn-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSchedule}
            disabled={loading}
            className={`btn btn-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon path={mdiPlus} size={0.8} />
            Tambah Hari
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Edukasi / Karir</label>

          {educationCareer.map((item, index) => (
            <div key={index} className="flex flex-wrap items-end gap-3 mb-4 sm:gap-4">
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="text-xs text-gray-500 mb-1">Pendidikan</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleChangeEducationCareer(index, "title", e.target.value)}
                  className="form-input"
                  placeholder="Judul Edukasi / Karir"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col w-[calc(50%-0.375rem)] sm:w-1/5">
                <label className="text-xs text-gray-500 mb-1">Tahun Mulai</label>
                <input
                  type="number"
                  value={item.start_year}
                  onChange={(e) => handleChangeEducationCareer(index, "start_year", e.target.value)}
                  className="form-input"
                  placeholder="Tahun Mulai"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-[calc(50%-0.375rem)] sm:w-1/5">
                <label className="text-xs text-gray-500 mb-1">Tahun Selesai</label>
                <input
                  type="number"
                  value={item.end_year}
                  onChange={(e) => handleChangeEducationCareer(index, "end_year", e.target.value)}
                  className="form-input"
                  placeholder="Tahun Selesai"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteEducationCareer(index)}
                disabled={loading}
                className={`btn btn-danger btn-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEducationCareer}
            disabled={loading}
            className={`btn btn-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon path={mdiPlus} size={0.8} />
            Tambah Baru
          </button>
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={loading}
            className="btn btn-outline"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
