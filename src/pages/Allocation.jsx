import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const Allocation = () => {
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [allocationData, setAllocationData] = useState({
    programId: '',
    quotaType: '',
    allotmentNumber: ''
  });
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    if (allocationData.programId && allocationData.quotaType && token) {
      checkAvailability();
    }
  }, [allocationData.programId, allocationData.quotaType]);

  const fetchData = async () => {
    try {
      const [applicantsRes, programsRes] = await Promise.all([
        fetch(`${API_URL}/applicants`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/masters/programs`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);

      if (!applicantsRes.ok) throw new Error('Failed to fetch applicants');
      if (!programsRes.ok) throw new Error('Failed to fetch programs');

      const applicantsData = await applicantsRes.json();
      const programsData = await programsRes.json();

      setApplicants(applicantsData);
      setPrograms(programsData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await fetch(
        `${API_URL}/allocation/availability/${allocationData.programId}/${allocationData.quotaType}`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to check availability');

      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAllocate = async () => {
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    if (!selectedApplicant) {
      toast.error('Please select an applicant');
      return;
    }

    if (!allocationData.programId || !allocationData.quotaType) {
      toast.error('Please select program and quota');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/allocation/allocate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicantId: selectedApplicant.id,
          programId: allocationData.programId,
          quotaType: allocationData.quotaType,
          allotmentNumber: allocationData.allotmentNumber
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Allocation failed');
      }

      toast.success('Seat allocated successfully');
      fetchData();
      setSelectedApplicant(null);
      setAllocationData({ programId: '', quotaType: '', allotmentNumber: '' });
      setAvailability(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConfirmAdmission = async (applicantId) => {
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/allocation/confirm/${applicantId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to confirm admission');
      }

      const data = await response.json();
      toast.success(`Admission confirmed! Admission Number: ${data.admissionNumber}`);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

// frontend/src/pages/Allocation.jsx - Remove Authorization header for fee update
const handleUpdateFee = async (applicantId, status) => {
  try {
    const response = await fetch(`${API_URL}/allocation/${applicantId}/fee`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // REMOVED Authorization header
      },
      body: JSON.stringify({ feeStatus: status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update fee status');
    }

    const data = await response.json();
    toast.success('Fee status updated');
    fetchData();
  } catch (error) {
    console.error('Error updating fee:', error);
    toast.error(error.message);
  }
};

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const pendingApplicants = applicants.filter(a => a.admission_status === 'pending');
  const allocatedApplicants = applicants.filter(a => a.admission_status === 'allocated');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Seat Allocation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Allocate Seat</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Applicant</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedApplicant?.id || ''}
                onChange={(e) => {
                  const applicant = applicants.find(a => a.id === e.target.value);
                  setSelectedApplicant(applicant || null);
                }}
              >
                <option value="">Select Applicant</option>
                {pendingApplicants.map((applicant) => (
                  <option key={applicant.id} value={applicant.id}>
                    {applicant.full_name} - {applicant.quota_type} - {applicant.program_name || 'No Program'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={allocationData.programId}
                onChange={(e) => setAllocationData({ ...allocationData, programId: e.target.value })}
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quota Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={allocationData.quotaType}
                onChange={(e) => setAllocationData({ ...allocationData, quotaType: e.target.value })}
              >
                <option value="">Select Quota</option>
                <option value="KCET">KCET</option>
                <option value="COMEDK">COMEDK</option>
                <option value="Management">Management</option>
              </select>
            </div>

            {availability && (
              <div className={`p-3 rounded ${availability.available ? 'bg-green-50' : 'bg-red-50'}`}>
                <p>Total Seats: {availability.total}</p>
                <p>Filled: {availability.filled}</p>
                <p>Remaining: {availability.remaining}</p>
                {!availability.available && (
                  <p className="text-red-600 font-semibold mt-1">No seats available in this quota!</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Allotment Number</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={allocationData.allotmentNumber}
                onChange={(e) => setAllocationData({ ...allocationData, allotmentNumber: e.target.value })}
                placeholder="Enter government allotment number"
              />
            </div>

            <button
              onClick={handleAllocate}
              disabled={!selectedApplicant || !availability?.available}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Allocate Seat
            </button>
          </div>
        </div>

        {/* Allocated Applicants */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Allocated Applicants</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {allocatedApplicants.map((applicant) => (
              <div key={applicant.id} className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{applicant.full_name}</p>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm">Quota: {applicant.quota_type}</p>
                    {applicant.allotment_number && (
                      <p className="text-sm">Allotment No: {applicant.allotment_number}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <select
                        value={applicant.fee_status}
                        onChange={(e) => handleUpdateFee(applicant.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Fee Pending</option>
                        <option value="paid">Fee Paid</option>
                      </select>
                    </div>
                    {applicant.fee_status === 'paid' && (
                      <button
                        onClick={() => handleConfirmAdmission(applicant.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Confirm Admission
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    applicant.fee_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Fee: {applicant.fee_status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
            {allocatedApplicants.length === 0 && (
              <p className="text-gray-500 text-center py-4">No allocated applicants</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allocation;

