// frontend/src/pages/Programs.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('programs');
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    institution: { name: '' },
    campus: { institutionId: '', name: '' },
    department: { campusId: '', name: '' },
    program: {
      departmentId: '',
      name: '',
      courseType: 'UG',
      entryType: 'Regular',
      admissionMode: 'Government',
      academicYear: new Date().getFullYear().toString(),
      totalIntake: 100,
      quotas: [
        { type: 'KCET', seats: 50 },
        { type: 'COMEDK', seats: 30 },
        { type: 'Management', seats: 20 }
      ]
    }
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'programs') {
        await fetchPrograms();
      } else if (activeTab === 'institutions') {
        await fetchInstitutions();
      } else if (activeTab === 'campuses') {
        await fetchCampuses();
      } else if (activeTab === 'departments') {
        await fetchDepartments();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    const response = await fetch(`${API_URL}/masters/programs`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch programs');
    const data = await response.json();
    setPrograms(data);
  };

  const fetchInstitutions = async () => {
    const response = await fetch(`${API_URL}/masters/institutions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch institutions');
    const data = await response.json();
    setInstitutions(data);
  };

const fetchCampuses = async () => {
  const response = await fetch(`${API_URL}/masters/campuses`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch campuses');
  const data = await response.json();
  setCampuses(data);
};

const fetchDepartments = async () => {
  const response = await fetch(`${API_URL}/masters/departments`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch departments');
  const data = await response.json();
  setDepartments(data);
};

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/masters/institutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData.institution),
      });
      
      if (!response.ok) throw new Error('Failed to create institution');
      
      toast.success('Institution created successfully');
      setShowModal(false);
      fetchInstitutions();
      setFormData({ ...formData, institution: { name: '' } });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateCampus = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/masters/campuses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData.campus),
      });
      
      if (!response.ok) throw new Error('Failed to create campus');
      
      toast.success('Campus created successfully');
      setShowModal(false);
      fetchCampuses();
      setFormData({ ...formData, campus: { institutionId: '', name: '' } });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/masters/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData.department),
      });
      
      if (!response.ok) throw new Error('Failed to create department');
      
      toast.success('Department created successfully');
      setShowModal(false);
      fetchDepartments();
      setFormData({ ...formData, department: { campusId: '', name: '' } });
    } catch (error) {
      toast.error(error.message);
    }
  };

const handleCreateProgram = async (e) => {
  e.preventDefault();
  try {
    // Calculate total seats from quotas to validate
    const totalSeatsFromQuotas = formData.program.quotas.reduce((sum, quota) => sum + quota.seats, 0);
    
    // Check if total seats from quotas matches total intake
    if (totalSeatsFromQuotas !== formData.program.totalIntake) {
      toast.error(`Total quota seats (${totalSeatsFromQuotas}) must equal total intake (${formData.program.totalIntake})`);
      return;
    }

    const programData = {
      departmentId: formData.program.departmentId,
      name: formData.program.name,
      courseType: formData.program.courseType,
      entryType: formData.program.entryType,
      admissionMode: formData.program.admissionMode,
      academicYear: formData.program.academicYear,
      totalIntake: formData.program.totalIntake,  // Changed from totalSeats to totalIntake
      quotas: formData.program.quotas.map(quota => ({
        type: quota.type,
        totalSeats: quota.seats,  // Map seats to totalSeats
        filledSeats: 0
      }))
    };
    
    console.log('Sending program data:', programData); // For debugging
    
    const response = await fetch(`${API_URL}/masters/programs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(programData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Server error:', error); // For debugging
      throw new Error(error.errors?.[0]?.msg || error.error || 'Failed to create program');
    }
    
    const data = await response.json();
    toast.success('Program created successfully');
    setShowModal(false);
    fetchPrograms();
    // Reset form
    setFormData({
      ...formData,
      program: {
        departmentId: '',
        name: '',
        courseType: 'UG',
        entryType: 'Regular',
        admissionMode: 'Government',
        academicYear: new Date().getFullYear().toString(),
        totalIntake: 100,
        quotas: [
          { type: 'KCET', seats: 50 },
          { type: 'COMEDK', seats: 30 },
          { type: 'Management', seats: 20 }
        ]
      }
    });
  } catch (error) {
    console.error('Create program error:', error); // For debugging
    toast.error(error.message);
  }
};

  const getModalContent = () => {
    switch (activeTab) {
      case 'institutions':
        return (
          <form onSubmit={handleCreateInstitution}>
            <h2 className="text-2xl font-bold mb-4">Create Institution</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Institution Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.institution.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    institution: { name: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
            </div>
          </form>
        );
      
      case 'campuses':
        return (
          <form onSubmit={handleCreateCampus}>
            <h2 className="text-2xl font-bold mb-4">Create Campus</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Institution</label>
                <select
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.campus.institutionId}
                  onChange={(e) => setFormData({
                    ...formData,
                    campus: { ...formData.campus, institutionId: e.target.value }
                  })}
                >
                  <option value="">Select Institution</option>
                  {institutions.map(inst => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Campus Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.campus.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    campus: { ...formData.campus, name: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
            </div>
          </form>
        );
      
      case 'departments':
        return (
          <form onSubmit={handleCreateDepartment}>
            <h2 className="text-2xl font-bold mb-4">Create Department</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campus</label>
                <select
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.department.campusId}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: { ...formData.department, campusId: e.target.value }
                  })}
                >
                  <option value="">Select Campus</option>
                  {campuses.map(campus => (
                    <option key={campus._id} value={campus._id}>{campus.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.department.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    department: { ...formData.department, name: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
            </div>
          </form>
        );
      
      case 'programs':
        return (
          <form onSubmit={handleCreateProgram}>
            <h2 className="text-2xl font-bold mb-4">Create Program</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.program.departmentId}
                  onChange={(e) => setFormData({
                    ...formData,
                    program: { ...formData.program, departmentId: e.target.value }
                  })}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Program Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.program.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    program: { ...formData.program, name: e.target.value }
                  })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Course Type</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.program.courseType}
                    onChange={(e) => setFormData({
                      ...formData,
                      program: { ...formData.program, courseType: e.target.value }
                    })}
                  >
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Entry Type</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.program.entryType}
                    onChange={(e) => setFormData({
                      ...formData,
                      program: { ...formData.program, entryType: e.target.value }
                    })}
                  >
                    <option value="Regular">Regular</option>
                    <option value="Lateral">Lateral</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Admission Mode</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={formData.program.admissionMode}
                    onChange={(e) => setFormData({
                      ...formData,
                      program: { ...formData.program, admissionMode: e.target.value }
                    })}
                  >
                    <option value="Government">Government</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Academic Year</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded px-3 py-2"
                    value={formData.program.academicYear}
                    onChange={(e) => setFormData({
                      ...formData,
                      program: { ...formData.program, academicYear: e.target.value }
                    })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Intake</label>
                <input
                  type="number"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={formData.program.totalIntake}
                  onChange={(e) => setFormData({
                    ...formData,
                    program: { ...formData.program, totalIntake: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quotas</label>
                {formData.program.quotas.map((quota, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Quota Type"
                      className="flex-1 border rounded px-3 py-2"
                      value={quota.type}
                      onChange={(e) => {
                        const newQuotas = [...formData.program.quotas];
                        newQuotas[index].type = e.target.value;
                        setFormData({
                          ...formData,
                          program: { ...formData.program, quotas: newQuotas }
                        });
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Seats"
                      className="w-32 border rounded px-3 py-2"
                      value={quota.seats}
                      onChange={(e) => {
                        const newQuotas = [...formData.program.quotas];
                        newQuotas[index].seats = parseInt(e.target.value);
                        setFormData({
                          ...formData,
                          program: { ...formData.program, quotas: newQuotas }
                        });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newQuotas = formData.program.quotas.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          program: { ...formData.program, quotas: newQuotas }
                        });
                      }}
                      className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    program: {
                      ...formData.program,
                      quotas: [...formData.program.quotas, { type: '', seats: 0 }]
                    }
                  })}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  + Add Quota
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Master Setup</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['programs', 'institutions', 'campuses', 'departments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{program.name}</h2>
                  <p className="text-gray-600">
                    {program.courseType} | {program.entryType} | {program.admissionMode}
                  </p>
                  <p className="text-gray-600">Academic Year: {program.academicYear}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{program.totalIntake}</p>
                  <p className="text-sm text-gray-500">Total Intake</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Quotas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {program.quotas.map((quota, index) => (
                    <div key={index} className="bg-gray-50 rounded p-3">
                      <p className="font-medium">{quota.type}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span>Seats: {quota.total}</span>
                        <span className={`font-bold ${quota.filled === quota.total ? 'text-red-600' : 'text-green-600'}`}>
                          Filled: {quota.filled}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${(quota.filled / quota.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'institutions' && (
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            {institutions.map((inst) => (
              <div key={inst._id} className="p-4">
                <h3 className="font-semibold text-lg">{inst.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'campuses' && (
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            {campuses.map((campus) => (
              <div key={campus._id} className="p-4">
                <h3 className="font-semibold text-lg">{campus.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            {departments.map((dept) => (
              <div key={dept._id} className="p-4">
                <h3 className="font-semibold text-lg">{dept.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {getModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;