import aboutApps from "../assets/aboutapps.png";
import azzahralyLogo from "../assets/KRSTI.png";
import unesaLogo from "../assets/unesa.png";
import dewoLogo from "../assets/dewo.png";
export default function About() {
  return (
    <>
      <div className="item-center grid h-screen place-content-center bg-gradient-to-br from-cyan-500 to-sky-950 ">
        <div className="item-center grid h-[85vh] w-[75vw] place-content-center rounded-xl bg-sky-200/30 backdrop-blur-sm">
          <div className="grid h-[70vh] w-[65vw] px-10 grid-cols-1 gap-7">
            <header className="flex justify-center items-center my-2">
              <img src={aboutApps} alt="About Apps" className="h-12 " />
            </header>
            <div className="h-[57vh] flex flex-col justify-start gap-8 text-white">
              <div className="flex flex-row gap-x-10">
                <img src={unesaLogo} alt="Unesa" className="h-28 col-start-1" />
                <p className="text-lg font-normal text-justify">
                  <b>Azzahraly Motion Apps</b> adalah perangkat lunak untuk
                  membuat gerakan pada robot tari humanoid. Aplikasi ini
                  memiliki <b>12 Fitur</b> utama yaitu{" "}
                  <b>
                    Dashboard, New Project, Import Project, New Motion, Add
                    Motion, Delete Motion, Save Project, Play Motion, Stop
                    Motion, Connect Robot{" "}
                  </b>{" "}
                  dan <b> Download Project.</b>
                </p>
              </div>
              <div className="flex flex-row gap-x-10">
                <p className="text-lg font-normal text-justify ">
                  Aplikasi ini adalah karya mahasiswa <b>DEWO ROBOTIK</b>{" "}
                  Fakultas Teknik <b>Universitas Negeri Surabaya. </b> Aplikasi
                  ini dibuat untuk membantu Tim Azzahraly membuat gerakan tari
                  pada robot tari humanoid. Apikasi ini dibuat terinspirasi dari
                  aplikasi RoboPlus 1.0 milik Robotis. Dan aplikasi ini adalah
                  generasi kedua dari aplikasi sebelumnya.
                </p>
                <img src={dewoLogo} alt="Unesa" className="h-28 col-start-1" />
              </div>
              <div className="flex flex-row gap-2">
                <img
                  src={azzahralyLogo}
                  alt="Azzahraly"
                  className="h-28 col-start-1"
                />
                <div className="flex flex-col gap-2 text-lg font-normal basis-11/12">
                  <p className="font-bold">Azzahraly Motion Apps</p>
                  <p>Version 2.1.1</p>
                  <p>
                    Copyright (C) 2024. <b>AZZAHRALY.</b> All right reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
