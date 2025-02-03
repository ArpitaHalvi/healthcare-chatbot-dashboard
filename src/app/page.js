"use client";
import { useState, useEffect } from "react";
import { Clock, Search, RefreshCw } from "lucide-react";

// Helper function to format dates consistently
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  // Update last updated time using client-side only
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/patients");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.mobile_number?.includes(searchTerm)
  );

  return (
    <section className="w-screen h-screen flex flex-col">
      <div className="w-full h-12 bg-neutral-800 text-white text-xl flex items-center justify-start">
        <div className="relative h-full aspect-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-2"
            viewBox="0 -960 960 960"
            fill="#cccccc"
          >
            <path d="M480-80q-73-9-145-39.5T206.5-207Q150-264 115-351T80-560v-40h40q51 0 105 13t101 39q12-86 54.5-176.5T480-880q57 65 99.5 155.5T634-548q47-26 101-39t105-13h40v40q0 122-35 209t-91.5 144q-56.5 57-128 87.5T480-80Zm-2-82q-11-166-98.5-251T162-518q11 171 101.5 255T478-162Zm2-254q15-22 36.5-45.5T558-502q-2-57-22.5-119T480-742q-35 59-55.5 121T402-502q20 17 42 40.5t36 45.5Zm78 236q37-12 77-35t74.5-62.5q34.5-39.5 59-98.5T798-518q-94 14-165 62.5T524-332q12 32 20.5 70t13.5 82Zm-78-236Zm78 236Zm-80 18Zm46-170ZM480-80Z" />
          </svg>
        </div>
        Healthcare Dashboard
      </div>
      <div className="flex grow">
        <div className="w-56 bg-neutral-800 flex flex-col p-4 gap-4">
          <div className="text-neutral-500 flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="M540-80q-108 0-184-76t-76-184v-23q-86-14-143-80.5T80-600v-240h120v-40h80v160h-80v-40h-40v160q0 66 47 113t113 47q66 0 113-47t47-113v-160h-40v40h-80v-160h80v40h120v240q0 90-57 156.5T360-363v23q0 75 52.5 127.5T540-160q75 0 127.5-52.5T720-340v-67q-35-12-57.5-43T640-520q0-50 35-85t85-35q50 0 85 35t35 85q0 39-22.5 70T800-407v67q0 108-76 184T540-80Zm220-400q17 0 28.5-11.5T800-520q0-17-11.5-28.5T760-560q-17 0-28.5 11.5T720-520q0 17 11.5 28.5T760-480Zm0-40Z" />
              </svg>
            </div>
            Doctors Panel
          </div>
          <div className="text-lg text-white pl-8">Patients Overview</div>
          <div className="text-lg text-white pl-8">Settings</div>
        </div>

        <div className="flex-1 p-6">
          <div className="flex flex-col gap-4 mb-4">
            <div className="text-4xl">Patients Overview</div>
            <div className=" flex gap-2 items-center justify-center text-neutral-100 bg-blue-500 w-52 p-1 rounded cursor-not-allowed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#eeeeee"
              >
                <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
              </svg>
              Manually Add Patient
            </div>
          </div>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={fetchPatients}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              <div className="bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Patient Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Blood Group
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Last Consultation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className="hover:bg-neutral-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {patient.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500">
                            {patient.age}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500">
                            {patient.blood_group || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500">
                            {patient.mobile_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500">
                            {formatDate(patient.last_consultation)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedPatient && (
            <div className="fixed inset-0 overflow-hidden h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-2/3 max-h-[90vh] flex flex-col relative">
                {/* Modal Header - Fixed */}
                <div className="flex justify-between items-center pb-4">
                  <h2 className="text-xl font-semibold">Patient Details</h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="overflow-y-auto flex-1">
                  <div className="grid gap-4">
                    <div>
                      <div className="font-medium">Personal Information</div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <div className="text-sm text-neutral-500">Name</div>
                          <div>{selectedPatient.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-500">Age</div>
                          <div>{selectedPatient.age}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-500">
                            Blood Group
                          </div>
                          <div>{selectedPatient.blood_group || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-neutral-500">Mobile</div>
                          <div>{selectedPatient.mobile_number}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium">Medical Information</div>
                      <div className="mt-2">
                        <div className="text-sm text-neutral-500">
                          Allergies
                        </div>
                        <div>
                          {selectedPatient.allergies || "None reported"}
                        </div>
                      </div>
                    </div>

                    {selectedPatient.consultations?.length > 0 && (
                      <div>
                        <div className="font-medium">Recent Consultations</div>
                        <div className="mt-2">
                          {selectedPatient.consultations.map(
                            (consultation, index) => (
                              <div
                                key={index}
                                className="mb-4 p-4 bg-neutral-50 rounded"
                              >
                                <div className="text-sm text-neutral-500">
                                  {formatDate(consultation.consultation_date)}
                                </div>
                                <div className="mt-2">
                                  <div className="font-medium">Symptoms</div>
                                  <div>{consultation.symptoms}</div>
                                </div>
                                <div className="mt-2">
                                  <div className="font-medium">
                                    Doctor's Summary
                                  </div>
                                  <div className="whitespace-pre-wrap">
                                    {consultation.doctor_summary}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
