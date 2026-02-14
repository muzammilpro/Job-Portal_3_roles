// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function CompanyProfilePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     industry: "",
//     size: "",
//     website: "",
//     phone: "",
//     location: "",
//     bio: "",
//     approvalDocument: "", // BASE64 STRING
//     approvalDocumentType: "", // mime type
//     socialLinks: {
//       github: "",
//       linkedin: "",
//       portfolio: "",
//     },
//   });

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.role === "company") {
//       fetchProfile();
//     } else if (status === "authenticated") {
//       router.push("/unauthorized");
//     }
//   }, [status, session]);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/company/profile");
//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Failed to load profile");
//       }

//       setForm({
//         ...form,
//         ...data.profile,
//         socialLinks: data.profile?.socialLinks || {
//           github: "",
//           linkedin: "",
//           portfolio: "",
//         },
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSocialChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       socialLinks: { ...prev.socialLinks, [name]: value },
//     }));
//   };

//   // 🔥 BASE64 CONVERSION
//   const handleDocumentUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // limit size (2MB)
//     if (file.size > 2 * 1024 * 1024) {
//       setError("File size must be under 2MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = () => {
//       setForm((prev) => ({
//         ...prev,
//         approvalDocument: reader.result, // BASE64
//         approvalDocumentType: file.type,
//       }));
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       setError(null);

//       const res = await fetch("/api/company/profile", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok || !data.success) {
//         throw new Error(data.message || "Update failed");
//       }

//       alert("Company profile updated successfully");
//       router.refresh?.();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (status === "loading" || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading company profile...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="max-w-5xl mx-auto px-4 py-10">

//         {error && (
//           <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-red-700">
//             {error}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-3xl shadow-xl p-8 space-y-8"
//         >
//           <h1 className="text-2xl font-bold">Company Profile</h1>

//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Company Name"
//             className="w-full border rounded-xl p-3"
//             required
//           />

//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Company Description"
//             className="w-full border rounded-xl p-3"
//           />

//           {/* 📄 BASE64 DOCUMENT UPLOAD */}
//           <div>
//             <h2 className="text-lg font-bold mb-2">
//               Company Approval Document
//             </h2>
//             <p className="text-sm text-gray-600 mb-3">
//               Upload registration / license document (PDF, JPG, PNG)
//             </p>

//             <input
//               type="file"
//               accept=".pdf,.jpg,.jpeg,.png"
//               onChange={handleDocumentUpload}
//             />

//             {form.approvalDocument && (
//               <div className="mt-4">
//                 {form.approvalDocumentType.includes("pdf") ? (
//                   <a
//                     href={form.approvalDocument}
//                     target="_blank"
//                     className="text-blue-600 underline"
//                   >
//                     View Uploaded PDF
//                   </a>
//                 ) : (
//                   <img
//                     src={form.approvalDocument}
//                     alt="Approval Document"
//                     className="max-w-xs rounded-lg border"
//                   />
//                 )}
//               </div>
//             )}
//           </div>

//           {/* SOCIAL LINKS */}
//           <input
//             name="github"
//             value={form.socialLinks.github}
//             onChange={handleSocialChange}
//             placeholder="GitHub URL"
//             className="w-full border rounded-xl p-3"
//           />

//           <input
//             name="linkedin"
//             value={form.socialLinks.linkedin}
//             onChange={handleSocialChange}
//             placeholder="LinkedIn URL"
//             className="w-full border rounded-xl p-3"
//           />

//           <input
//             name="portfolio"
//             value={form.socialLinks.portfolio}
//             onChange={handleSocialChange}
//             placeholder="Portfolio / Careers Page"
//             className="w-full border rounded-xl p-3"
//           />

//           <div className="flex justify-end gap-4 pt-6">
//             <button
//               type="button"
//               onClick={() => router.push("/company/dashboard")}
//               className="px-5 py-2 rounded-xl border"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={saving}
//               className="px-6 py-2 rounded-xl bg-blue-600 text-white"
//             >
//               {saving ? "Saving..." : "Save Profile"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const EMPTY_FORM = {
  name: "",
  description: "",
  industry: "",
  size: "",
  website: "",
  phone: "",
  location: "",
  bio: "",
  approvalDocument: "",
  approvalDocumentType: "",
  socialLinks: {
    github: "",
    linkedin: "",
    portfolio: "",
  },
};

export default function CompanyProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ───────────────────────── FETCH PROFILE ───────────────────────── */
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "company") {
        router.push("/unauthorized");
      } else {
        loadProfile();
      }
    }
  }, [status]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/company/profile", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setForm({
        ...EMPTY_FORM,
        ...data.profile,
        socialLinks: data.profile?.socialLinks || EMPTY_FORM.socialLinks,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────── INPUT HANDLERS ───────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      socialLinks: { ...p.socialLinks, [name]: value },
    }));
  };

  /* ───────────────────────── FILE UPLOAD (BASE64) ───────────────────────── */
  const handleDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, JPG, PNG files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((p) => ({
        ...p,
        approvalDocument: reader.result,
        approvalDocumentType: file.type,
      }));
    };

    reader.readAsDataURL(file);
  };

  /* ───────────────────────── SUBMIT ───────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/company/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Update failed");
      }

      alert("Profile updated successfully ");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ───────────────────────── LOADING ───────────────────────── */
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading company profile...
      </div>
    );
  }

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Company Profile</h1>
            <p className="text-slate-600 mt-1">Manage your company information and details</p>
          </div>

          {/* BASIC INFORMATION */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Basic Information</h2>

            {/* <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Tech Solutions Inc."
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div> */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a brief overview of your company..."
                rows="3"
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry
                </label>
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Healthcare, Finance"
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Size
                </label>
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                About / Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us more about your company's mission, values, and culture..."
                rows="4"
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>
          </div>

          {/* CONTACT DETAILS */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Contact Details</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website
              </label>
              <input
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://www.yourcompany.com"
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* APPROVAL DOCUMENT */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Approval Document</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Company Registration / License
              </label>
              <p className="text-sm text-slate-500 mb-3">
                Upload your company registration document or business license (PDF, JPG, PNG - Max 2MB)
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {form.approvalDocument && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  {form.approvalDocumentType === "application/pdf" ? (
                    <a
                      href={form.approvalDocument}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      📄 View Uploaded PDF Document
                    </a>
                  ) : (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Preview:</p>
                      <img
                        src={form.approvalDocument}
                        alt="Approval Document"
                        className="max-w-md rounded-lg border border-slate-300 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">Social Links</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GitHub URL
              </label>
              <input
                name="github"
                type="url"
                value={form.socialLinks.github}
                onChange={handleSocialChange}
                placeholder="https://github.com/yourcompany"
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                LinkedIn URL
              </label>
              <input
                name="linkedin"
                type="url"
                value={form.socialLinks.linkedin}
                onChange={handleSocialChange}
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Portfolio / Careers Page
              </label>
              <input
                name="portfolio"
                type="url"
                value={form.socialLinks.portfolio}
                onChange={handleSocialChange}
                placeholder="https://yourcompany.com/careers"
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/company/dashboard")}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
