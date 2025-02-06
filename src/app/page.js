"use client";
import { useState, useEffect } from "react";
import { Clock, Search, RefreshCw, Menu, X } from "lucide-react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

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
    const interval = setInterval(updateTime, 60000);
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
    <section className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="w-full h-12 bg-neutral-800 text-white text-xl flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden mr-4"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="relative h-12 aspect-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full p-2"
              viewBox="0 -960 960 960"
              fill="#cccccc"
            >
              <path d="M480-80q-73-9-145-39.5T206.5-207Q150-264 115-351T80-560v-40h40q51 0 105 13t101 39q12-86 54.5-176.5T480-880q57 65 99.5 155.5T634-548q47-26 101-39t105-13h40v40q0 122-35 209t-91.5 144q-56.5 57-128 87.5T480-80Z" />
            </svg>
          </div>
          <span className="ml-2">Healthcare Dashboard</span>
        </div>
      </div>

      <div className="flex grow relative">
        {/* Sidebar - Mobile Overlay */}
        <div
          className={`
          hidden md:flex md:relative md:translate-x-0 md:w-56
          fixed inset-y-0 left-0 w-64 bg-neutral-800 transform transition-transform duration-200 ease-in-out z-20
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex flex-col p-4 gap-4">
            <div className="text-neutral-500 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="M540-80q-108 0-184-76t-76-184v-23q-86-14-143-80.5T80-600v-240h120v-40h80v160h-80v-40h-40v160q0 66 47 113t113 47q66 0 113-47t47-113v-160h-40v40h-80v-160h80v40h120v240q0 90-57 156.5T360-363v23q0 75 52.5 127.5T540-160q75 0 127.5-52.5T720-340v-67q-35-12-57.5-43T640-520q0-50 35-85t85-35q50 0 85 35t35 85q0 39-22.5 70T800-407v67q0 108-76 184T540-80Z" />
              </svg>
              Doctors Panel
            </div>
            <div className="text-lg text-white pl-8">Patients Overview</div>
            <div className="text-lg text-white pl-8">Settings</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex flex-col gap-4 mb-4">
            <div className="text-2xl md:text-4xl">Patients Overview</div>
            <div className="flex gap-2 items-center justify-center text-neutral-100 bg-blue-500 w-full md:w-52 p-1 rounded cursor-not-allowed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#eeeeee"
              >
                <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z" />
              </svg>
              Manually Add Patient
            </div>
          </div>

          {/* Search and Controls */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center">
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={fetchPatients}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg w-full md:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-500">
                Last updated: {lastUpdated}
              </span>
            </div>
          </div>

          {/* Patient Table/List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden md:rounded-lg shadow">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Blood Group
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Mobile
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
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
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900">
                              {patient.name}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-500">
                              {patient.age}
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-500">
                              {patient.blood_group || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-500">
                              {patient.mobile_number}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-500">
                              {patient.email || "-"}
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
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
            </div>
          )}

          {/* Patient Details Modal */}
          {selectedPatient && (
            <div className="fixed inset-0 overflow-hidden h-full w-full bg-black bg-opacity-50 flex items-center justify-center p-4 z-30">
              <div className="bg-white rounded-lg p-4 md:p-6 w-full md:w-2/3 max-h-[90vh] flex flex-col relative">
                <div className="flex justify-between items-center pb-4">
                  <h2 className="text-xl font-semibold">Patient Details</h2>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="overflow-y-auto flex-1">
                  <div className="grid gap-4">
                    <div>
                      <div className="font-medium">Personal Information</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
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
