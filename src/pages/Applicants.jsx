// // frontend/src/pages/Applicants.js
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import toast from 'react-hot-toast';

// const API_URL = 'https://admission-management-be.onrender.com/api';

// const Applicants = () => {
//   const [applicants, setApplicants] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const { token } = useAuth();

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     category: 'GM',
//     entryType: 'Regular',
//     quotaType: 'KCET',
//     programId: '',
//     marksObtained: 0,
//     totalMarks: 100
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [applicantsRes, programsRes] = await Promise.all([
//         fetch(`${API_URL}/applicants`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         }),
//         fetch(`${API_URL}/masters/programs`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         })
//       ]);

//       if (!applicantsRes.ok) throw new Error('Failed to fetch applicants');
//       if (!programsRes.ok) throw new Error('Failed to fetch programs');

//       const applicantsData = await applicantsRes.json();
//       const programsData = await programsRes.json();

//       setApplicants(applicantsData);
//       setPrograms(programsData);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateApplicant = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/applicants`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to create applicant');
//       }

//       toast.success('Applicant created successfully');
//       setShowModal(false);
//       fetchData();
//       resetForm();
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

// // frontend/src/pages/Applicants.jsx - Updated document update function
// const handleDocumentUpdate = async (applicantId, docType, status) => {
//   try {
//     const response = await fetch(`${API_URL}/applicants/${applicantId}/documents`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({ 
//         documentType: docType,  // Send as payload instead of URL param
//         status: status 
//       }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to update document');
//     }

//     const data = await response.json();
//     toast.success('Document status updated');
//     fetchData(); // Refresh the data
//   } catch (error) {
//     console.error('Error updating document:', error);
//     toast.error(error.message);
//   }
// };

//   const resetForm = () => {
//     setFormData({
//       fullName: '',
//       email: '',
//       phone: '',
//       dateOfBirth: '',
//       category: 'GM',
//       entryType: 'Regular',
//       quotaType: 'KCET',
//       programId: '',
//       marksObtained: 0,
//       totalMarks: 100
//     });
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading applicants...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">Applicants Management</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Add Applicant
//         </button>
//       </div>

//       <div className="space-y-6">
//         {applicants.map((applicant) => (
//           <div key={applicant.id} className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h2 className="text-xl font-semibold">{applicant.full_name}</h2>
//                 <p className="text-gray-600">{applicant.email} | {applicant.phone}</p>
//                 <p className="text-gray-600">
//                   Category: {applicant.category} | Entry: {applicant.entry_type} | Quota: {applicant.quota_type}
//                 </p>
//                 <p className="text-gray-600">
//                   Program: {applicant.program_name} | Marks: {applicant.marks_obtained}/{applicant.total_marks}
//                 </p>
//                 {applicant.admission_number && (
//                   <p className="text-green-600 font-semibold mt-1">Admission No: {applicant.admission_number}</p>
//                 )}
//               </div>
//               <div className="text-right">
//                 <span className={`inline-block px-3 py-1 rounded text-sm ${
//                   applicant.admission_status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                   applicant.admission_status === 'allocated' ? 'bg-blue-100 text-blue-800' :
//                   'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {applicant.admission_status.toUpperCase()}
//                 </span>
//                 <span className={`inline-block ml-2 px-3 py-1 rounded text-sm ${
//                   applicant.fee_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   Fee: {applicant.fee_status.toUpperCase()}
//                 </span>
//               </div>
//             </div>

//             <div className="border-t pt-4">
//               <h3 className="font-semibold mb-2">Documents</h3>
// <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//   {applicant.documents.map((doc, index) => (
//     <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
//       <span className="text-sm">{doc.type}</span>
//       <select
//         value={doc.status}
//         onChange={(e) => handleDocumentUpdate(applicant.id, doc.type, e.target.value)}
//         className="text-sm border rounded px-2 py-1"
//       >
//         <option value="pending">Pending</option>
//         <option value="submitted">Submitted</option>
//         <option value="verified">Verified</option>
//       </select>
//     </div>
//   ))}
// </div>
//             </div>
//           </div>
//         ))}

//         {applicants.length === 0 && (
//           <div className="bg-white rounded-lg shadow p-12 text-center">
//             <p className="text-gray-500">No applicants found. Click "Add Applicant" to create one.</p>
//           </div>
//         )}
//       </div>

//       {/* Create Applicant Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4">Create New Applicant</h2>
//             <form onSubmit={handleCreateApplicant}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Full Name *</label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full border rounded px-3 py-2"
//                     value={formData.fullName}
//                     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Email *</label>
//                   <input
//                     type="email"
//                     required
//                     className="w-full border rounded px-3 py-2"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Phone</label>
//                   <input
//                     type="tel"
//                     className="w-full border rounded px-3 py-2"
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Date of Birth</label>
//                   <input
//                     type="date"
//                     className="w-full border rounded px-3 py-2"
//                     value={formData.dateOfBirth}
//                     onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Category *</label>
//                     <select
//                       required
//                       className="w-full border rounded px-3 py-2"
//                       value={formData.category}
//                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                     >
//                       <option value="GM">GM</option>
//                       <option value="SC">SC</option>
//                       <option value="ST">ST</option>
//                       <option value="OBC">OBC</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">Entry Type *</label>
//                     <select
//                       required
//                       className="w-full border rounded px-3 py-2"
//                       value={formData.entryType}
//                       onChange={(e) => setFormData({ ...formData, entryType: e.target.value })}
//                     >
//                       <option value="Regular">Regular</option>
//                       <option value="Lateral">Lateral</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Quota Type *</label>
//                     <select
//                       required
//                       className="w-full border rounded px-3 py-2"
//                       value={formData.quotaType}
//                       onChange={(e) => setFormData({ ...formData, quotaType: e.target.value })}
//                     >
//                       <option value="KCET">KCET</option>
//                       <option value="COMEDK">COMEDK</option>
//                       <option value="Management">Management</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">Program *</label>
//                     <select
//                       required
//                       className="w-full border rounded px-3 py-2"
//                       value={formData.programId}
//                       onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
//                     >
//                       <option value="">Select Program</option>
//                       {programs.map((program) => (
//                         <option key={program.id} value={program.id}>{program.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Marks Obtained</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       className="w-full border rounded px-3 py-2"
//                       value={formData.marksObtained}
//                       onChange={(e) => setFormData({ ...formData, marksObtained: parseFloat(e.target.value) })}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">Total Marks</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       className="w-full border rounded px-3 py-2"
//                       value={formData.totalMarks}
//                       onChange={(e) => setFormData({ ...formData, totalMarks: parseFloat(e.target.value) })}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 border rounded hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Create Applicant
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Applicants;


// frontend/src/pages/Applicants.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_URL = 'https://admission-management-be.onrender.com/api';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    category: 'GM',
    entryType: 'Regular',
    quotaType: 'KCET',
    programId: '',
    marksObtained: 0,
    totalMarks: 100
  });

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

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

  const handleCreateApplicant = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/applicants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create applicant');
      }

      toast.success('Applicant created successfully');
      setShowModal(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

// frontend/src/pages/Applicants.jsx - Remove Authorization header for document update
const handleDocumentUpdate = async (applicantId, docType, status) => {
  try {
    const response = await fetch(`${API_URL}/applicants/${applicantId}/documents`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // REMOVED Authorization header
      },
      body: JSON.stringify({ 
        documentType: docType,
        status: status 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update document');
    }

    const data = await response.json();
    toast.success('Document status updated');
    fetchData();
  } catch (error) {
    console.error('Error updating document:', error);
    toast.error(error.message);
  }
};

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      category: 'GM',
      entryType: 'Regular',
      quotaType: 'KCET',
      programId: '',
      marksObtained: 0,
      totalMarks: 100
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading applicants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Applicants Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Applicant
        </button>
      </div>

      <div className="space-y-6">
        {applicants.map((applicant) => (
          <div key={applicant.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{applicant.full_name}</h2>
                <p className="text-gray-600">{applicant.email} | {applicant.phone}</p>
                <p className="text-gray-600">
                  Category: {applicant.category} | Entry: {applicant.entry_type} | Quota: {applicant.quota_type}
                </p>
                <p className="text-gray-600">
                  Program: {applicant.program_name} | Marks: {applicant.marks_obtained}/{applicant.total_marks}
                </p>
                {applicant.admission_number && (
                  <p className="text-green-600 font-semibold mt-1">Admission No: {applicant.admission_number}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded text-sm ${
                  applicant.admission_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  applicant.admission_status === 'allocated' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {applicant.admission_status.toUpperCase()}
                </span>
                <span className={`inline-block ml-2 px-3 py-1 rounded text-sm ${
                  applicant.fee_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  Fee: {applicant.fee_status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {applicant.documents.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">{doc.type}</span>
                    <select
                      value={doc.status}
                      onChange={(e) => handleDocumentUpdate(applicant.id, doc.type, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="verified">Verified</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {applicants.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No applicants found. Click "Add Applicant" to create one.</p>
          </div>
        )}
      </div>

      {/* Create Applicant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Applicant</h2>
            <form onSubmit={handleCreateApplicant}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full border rounded px-3 py-2"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full border rounded px-3 py-2"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full border rounded px-3 py-2"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      required
                      className="w-full border rounded px-3 py-2"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="GM">GM</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="OBC">OBC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Entry Type *</label>
                    <select
                      required
                      className="w-full border rounded px-3 py-2"
                      value={formData.entryType}
                      onChange={(e) => setFormData({ ...formData, entryType: e.target.value })}
                    >
                      <option value="Regular">Regular</option>
                      <option value="Lateral">Lateral</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quota Type *</label>
                    <select
                      required
                      className="w-full border rounded px-3 py-2"
                      value={formData.quotaType}
                      onChange={(e) => setFormData({ ...formData, quotaType: e.target.value })}
                    >
                      <option value="KCET">KCET</option>
                      <option value="COMEDK">COMEDK</option>
                      <option value="Management">Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Program *</label>
                    <select
                      required
                      className="w-full border rounded px-3 py-2"
                      value={formData.programId}
                      onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                    >
                      <option value="">Select Program</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>{program.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Marks Obtained</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border rounded px-3 py-2"
                      value={formData.marksObtained}
                      onChange={(e) => setFormData({ ...formData, marksObtained: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Total Marks</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border rounded px-3 py-2"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Applicant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;

