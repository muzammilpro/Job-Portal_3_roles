// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";

// export default function UserProfile() {
//   const { data: session } = useSession();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");

//   // Initial profile data
//   const [profileData, setProfileData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     location: "",
//     bio: "",
//     skills: [],
//     experience: [],
//     education: [],
//     resume: null,
//     github: "",
//     linkedin: "",
//     portfolio: "",
//   });

//   // Initialize with session data
//   useEffect(() => {
//     if (session?.user) {
//       setProfileData(prev => ({
//         ...prev,
//         fullName: session.user.name || "",
//         email: session.user.email || "",
//       }));
//     }
//   }, [session]);

//   // Handle image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle skills input
//   const handleSkillsChange = (e) => {
//     const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
//     setProfileData(prev => ({
//       ...prev,
//       skills: skillsArray
//     }));
//   };

//   // Add experience
//   const [newExperience, setNewExperience] = useState({
//     title: "",
//     company: "",
//     location: "",
//     startDate: "",
//     endDate: "",
//     current: false,
//     description: "",
//   });

//   const handleAddExperience = () => {
//     if (newExperience.title && newExperience.company) {
//       setProfileData(prev => ({
//         ...prev,
//         experience: [...prev.experience, newExperience]
//       }));
//       setNewExperience({
//         title: "",
//         company: "",
//         location: "",
//         startDate: "",
//         endDate: "",
//         current: false,
//         description: "",
//       });
//     }
//   };

//   // Add education
//   const [newEducation, setNewEducation] = useState({
//     degree: "",
//     institution: "",
//     field: "",
//     startDate: "",
//     endDate: "",
//     gpa: "",
//   });

//   const handleAddEducation = () => {
//     if (newEducation.degree && newEducation.institution) {
//       setProfileData(prev => ({
//         ...prev,
//         education: [...prev.education, newEducation]
//       }));
//       setNewEducation({
//         degree: "",
//         institution: "",
//         field: "",
//         startDate: "",
//         endDate: "",
//         gpa: "",
//       });
//     }
//   };

//   // Handle resume upload
//   const handleResumeUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileData(prev => ({
//         ...prev,
//         resume: file
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       // Create FormData for file uploads
//       const formData = new FormData();
//       formData.append("fullName", profileData.fullName);
//       formData.append("email", profileData.email);
//       formData.append("phone", profileData.phone);
//       formData.append("location", profileData.location);
//       formData.append("bio", profileData.bio);
//       formData.append("skills", JSON.stringify(profileData.skills));
//       formData.append("experience", JSON.stringify(profileData.experience));
//       formData.append("education", JSON.stringify(profileData.education));
//       formData.append("github", profileData.github);
//       formData.append("linkedin", profileData.linkedin);
//       formData.append("portfolio", profileData.portfolio);
      
//       if (profileImage) {
//         formData.append("profileImage", profileImage);
//       }
      
//       if (profileData.resume) {
//         formData.append("resume", profileData.resume);
//       }

//       // Here you would make an API call to save the profile
//       // For example:
//       // const response = await fetch('/api/user/profile', {
//       //   method: 'POST',
//       //   body: formData,
//       // });
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       console.log("Profile saved:", profileData);
//       setIsEditing(false);
//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       alert("Failed to save profile. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>User Profile</h1>
//         <p style={styles.subtitle}>Complete your profile to increase job opportunities</p>
//       </div>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         {/* Profile Header */}
//         <div style={styles.profileHeader}>
//           <div style={styles.avatarSection}>
//             <div style={styles.avatarContainer}>
//               {imagePreview ? (
//                 <img src={imagePreview} alt="Profile" style={styles.avatarImage} />
//               ) : (
//                 <div style={styles.avatarPlaceholder}>
//                   {profileData.fullName.charAt(0).toUpperCase() || "U"}
//                 </div>
//               )}
//               {isEditing && (
//                 <label style={styles.uploadButton}>
//                   Change Photo
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     style={styles.fileInput}
//                   />
//                 </label>
//               )}
//             </div>
//           </div>
          
//           <div style={styles.profileStats}>
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>0</span>
//               <span style={styles.statLabel}>Jobs Applied</span>
//             </div>
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>0</span>
//               <span style={styles.statLabel}>Interviews</span>
//             </div>
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>0%</span>
//               <span style={styles.statLabel}>Profile Complete</span>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div style={styles.actionButtons}>
//           {!isEditing ? (
//             <button
//               type="button"
//               onClick={() => setIsEditing(true)}
//               style={styles.editButton}
//             >
//               Edit Profile
//             </button>
//           ) : (
//             <div style={styles.editActionButtons}>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 style={styles.saveButton}
//               >
//                 {isLoading ? "Saving..." : "Save Changes"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(false)}
//                 style={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Basic Information */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Basic Information</h2>
//           <div style={styles.formGrid}>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Full Name *</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={profileData.fullName}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 required
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Email *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={profileData.email}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 required
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Phone Number</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={profileData.phone}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="+1 (123) 456-7890"
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={profileData.location}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="City, Country"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Bio */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Professional Bio</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Tell us about yourself</label>
//             <textarea
//               name="bio"
//               value={profileData.bio}
//               onChange={handleInputChange}
//               disabled={!isEditing}
//               style={styles.textarea}
//               placeholder="Describe your professional background, interests, and career goals..."
//               rows={4}
//             />
//           </div>
//         </div>

//         {/* Skills */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Skills</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Add your skills (comma separated)</label>
//             <input
//               type="text"
//               value={profileData.skills.join(', ')}
//               onChange={handleSkillsChange}
//               disabled={!isEditing}
//               style={styles.input}
//               placeholder="JavaScript, React, Node.js, Python"
//             />
//             {profileData.skills.length > 0 && (
//               <div style={styles.skillsContainer}>
//                 {profileData.skills.map((skill, index) => (
//                   <span key={index} style={styles.skillTag}>
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Work Experience */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Work Experience</h2>
//           {profileData.experience.map((exp, index) => (
//             <div key={index} style={styles.experienceItem}>
//               <h3 style={styles.experienceTitle}>{exp.title}</h3>
//               <p style={styles.experienceCompany}>{exp.company} • {exp.location}</p>
//               <p style={styles.experienceDuration}>
//                 {exp.startDate} - {exp.current ? "Present" : exp.endDate}
//               </p>
//               <p style={styles.experienceDescription}>{exp.description}</p>
//             </div>
//           ))}
          
//           {isEditing && (
//             <div style={styles.addForm}>
//               <h3 style={styles.addFormTitle}>Add New Experience</h3>
//               <div style={styles.formGrid}>
//                 <input
//                   type="text"
//                   placeholder="Job Title"
//                   value={newExperience.title}
//                   onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Company"
//                   value={newExperience.company}
//                   onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Location"
//                   value={newExperience.location}
//                   onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="Start Date"
//                   value={newExperience.startDate}
//                   onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="End Date"
//                   value={newExperience.endDate}
//                   onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
//                   disabled={newExperience.current}
//                   style={styles.input}
//                 />
//                 <label style={styles.checkboxLabel}>
//                   <input
//                     type="checkbox"
//                     checked={newExperience.current}
//                     onChange={(e) => setNewExperience(prev => ({ ...prev, current: e.target.checked }))}
//                     style={styles.checkbox}
//                   />
//                   Currently working here
//                 </label>
//               </div>
//               <textarea
//                 placeholder="Job Description"
//                 value={newExperience.description}
//                 onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
//                 style={styles.textarea}
//                 rows={3}
//               />
//               <button
//                 type="button"
//                 onClick={handleAddExperience}
//                 style={styles.addButton}
//               >
//                 Add Experience
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Education */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Education</h2>
//           {profileData.education.map((edu, index) => (
//             <div key={index} style={styles.educationItem}>
//               <h3 style={styles.educationDegree}>{edu.degree} in {edu.field}</h3>
//               <p style={styles.educationInstitution}>{edu.institution}</p>
//               <p style={styles.educationDuration}>
//                 {edu.startDate} - {edu.endDate}
//                 {edu.gpa && ` • GPA: ${edu.gpa}`}
//               </p>
//             </div>
//           ))}
          
//           {isEditing && (
//             <div style={styles.addForm}>
//               <h3 style={styles.addFormTitle}>Add Education</h3>
//               <div style={styles.formGrid}>
//                 <input
//                   type="text"
//                   placeholder="Degree"
//                   value={newEducation.degree}
//                   onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Institution"
//                   value={newEducation.institution}
//                   onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Field of Study"
//                   value={newEducation.field}
//                   onChange={(e) => setNewEducation(prev => ({ ...prev, field: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="Start Date"
//                   value={newEducation.startDate}
//                   onChange={(e) => setNewEducation(prev => ({ ...prev, startDate: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="End Date"
//                   value={newEducation.endDate}
//                   onChange={(e) => setNewEducation(prev => ({ ...prev, endDate: e.target.value }))}
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="GPA"
//                   value={newEducation.gpa}
//                   onChange={(e) => setNewEducation(prev => ({ ...prev, gpa: e.target.value }))}
//                   style={styles.input}
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={handleAddEducation}
//                 style={styles.addButton}
//               >
//                 Add Education
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Resume */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Resume</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Upload your resume</label>
//             {profileData.resume ? (
//               <div style={styles.resumeInfo}>
//                 <span>📄 {profileData.resume.name || "resume.pdf"}</span>
//                 {isEditing && (
//                   <label style={styles.uploadResumeButton}>
//                     Change Resume
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       onChange={handleResumeUpload}
//                       style={styles.fileInput}
//                     />
//                   </label>
//                 )}
//               </div>
//             ) : (
//               isEditing && (
//                 <label style={styles.uploadResumeButton}>
//                   Upload Resume (PDF, DOC)
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     onChange={handleResumeUpload}
//                     style={styles.fileInput}
//                   />
//                 </label>
//               )
//             )}
//           </div>
//         </div>

//         {/* Social Links */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Social Links</h2>
//           <div style={styles.formGrid}>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>GitHub</label>
//               <input
//                 type="url"
//                 name="github"
//                 value={profileData.github}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="https://github.com/username"
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>LinkedIn</label>
//               <input
//                 type="url"
//                 name="linkedin"
//                 value={profileData.linkedin}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="https://linkedin.com/in/username"
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Portfolio</label>
//               <input
//                 type="url"
//                 name="portfolio"
//                 value={profileData.portfolio}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="https://yourportfolio.com"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons at Bottom */}
//         {isEditing && (
//           <div style={styles.bottomActions}>
//             <button
//               type="submit"
//               disabled={isLoading}
//               style={styles.saveButton}
//             >
//               {isLoading ? "Saving..." : "Save All Changes"}
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsEditing(false)}
//               style={styles.cancelButton}
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: "1000px",
//     margin: "0 auto",
//     padding: "2rem 1rem",
//     backgroundColor: "#f8fafc",
//     minHeight: "100vh",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: "2rem",
//   },
//   title: {
//     fontSize: "2.5rem",
//     fontWeight: "bold",
//     color: "#1e293b",
//     marginBottom: "0.5rem",
//   },
//   subtitle: {
//     fontSize: "1.1rem",
//     color: "#64748b",
//   },
//   form: {
//     backgroundColor: "white",
//     borderRadius: "12px",
//     padding: "2rem",
//     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//   },
//   profileHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "2rem",
//     paddingBottom: "2rem",
//     borderBottom: "1px solid #e2e8f0",
//   },
//   avatarSection: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1.5rem",
//   },
//   avatarContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "1rem",
//   },
//   avatarImage: {
//     width: "120px",
//     height: "120px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "4px solid #e2e8f0",
//   },
//   avatarPlaceholder: {
//     width: "120px",
//     height: "120px",
//     borderRadius: "50%",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "3rem",
//     fontWeight: "bold",
//     border: "4px solid #e2e8f0",
//   },
//   uploadButton: {
//     padding: "0.5rem 1rem",
//     backgroundColor: "#f1f5f9",
//     color: "#475569",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     position: "relative",
//     overflow: "hidden",
//   },
//   fileInput: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     opacity: 0,
//     cursor: "pointer",
//   },
//   profileStats: {
//     display: "flex",
//     gap: "2rem",
//   },
//   statItem: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "1rem",
//     backgroundColor: "#f8fafc",
//     borderRadius: "8px",
//     minWidth: "100px",
//   },
//   statNumber: {
//     fontSize: "1.5rem",
//     fontWeight: "bold",
//     color: "#3b82f6",
//   },
//   statLabel: {
//     fontSize: "0.875rem",
//     color: "#64748b",
//     marginTop: "0.25rem",
//   },
//   actionButtons: {
//     display: "flex",
//     justifyContent: "flex-end",
//     marginBottom: "2rem",
//   },
//   editButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     transition: "background-color 0.2s",
//   },
//   editActionButtons: {
//     display: "flex",
//     gap: "1rem",
//   },
//   saveButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#10b981",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     transition: "background-color 0.2s",
//   },
//   cancelButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#ef4444",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     transition: "background-color 0.2s",
//   },
//   section: {
//     marginBottom: "2.5rem",
//     paddingBottom: "2rem",
//     borderBottom: "1px solid #e2e8f0",
//   },
//   sectionTitle: {
//     fontSize: "1.5rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "1.5rem",
//   },
//   formGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//   },
//   formGroup: {
//     marginBottom: "1.5rem",
//   },
//   label: {
//     display: "block",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     color: "#475569",
//     marginBottom: "0.5rem",
//   },
//   input: {
//     width: "100%",
//     padding: "0.75rem 1rem",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     fontSize: "1rem",
//     color: "#1e293b",
//     backgroundColor: "white",
//     transition: "border-color 0.2s",
//   },
//   textarea: {
//     width: "100%",
//     padding: "0.75rem 1rem",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     fontSize: "1rem",
//     color: "#1e293b",
//     backgroundColor: "white",
//     fontFamily: "inherit",
//     resize: "vertical",
//     minHeight: "100px",
//   },
//   skillsContainer: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "0.5rem",
//     marginTop: "1rem",
//   },
//   skillTag: {
//     padding: "0.375rem 0.75rem",
//     backgroundColor: "#dbeafe",
//     color: "#1d4ed8",
//     borderRadius: "9999px",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//   },
//   experienceItem: {
//     backgroundColor: "#f8fafc",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     marginBottom: "1rem",
//   },
//   experienceTitle: {
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "0.25rem",
//   },
//   experienceCompany: {
//     color: "#475569",
//     marginBottom: "0.25rem",
//   },
//   experienceDuration: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//     marginBottom: "0.75rem",
//   },
//   experienceDescription: {
//     color: "#475569",
//     lineHeight: "1.6",
//   },
//   addForm: {
//     backgroundColor: "#f1f5f9",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     marginTop: "1.5rem",
//   },
//   addFormTitle: {
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "1rem",
//   },
//   checkboxLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "0.875rem",
//     color: "#475569",
//     gridColumn: "span 2",
//   },
//   checkbox: {
//     width: "1rem",
//     height: "1rem",
//   },
//   addButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     marginTop: "1rem",
//   },
//   educationItem: {
//     backgroundColor: "#f8fafc",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     marginBottom: "1rem",
//   },
//   educationDegree: {
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "0.25rem",
//   },
//   educationInstitution: {
//     color: "#475569",
//     marginBottom: "0.25rem",
//   },
//   educationDuration: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//   },
//   resumeInfo: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "1rem",
//     backgroundColor: "#f8fafc",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//   },
//   uploadResumeButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#f1f5f9",
//     color: "#475569",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     position: "relative",
//     overflow: "hidden",
//     display: "inline-block",
//   },
//   bottomActions: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "1rem",
//     paddingTop: "2rem",
//     borderTop: "1px solid #e2e8f0",
//     marginTop: "2rem",
//   },
// };


// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function UserProfile() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [profileImage, setProfileImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [resumeFile, setResumeFile] = useState(null);

//   // Profile data state
//   const [profileData, setProfileData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     location: "",
//     bio: "",
//     skills: [],
//     experience: [],
//     education: [],
//     resume: null,
//     github: "",
//     linkedin: "",
//     portfolio: "",
//     profileCompletion: 0,
//     jobsApplied: 0,
//     interviews: 0,
//   });

//   // Form for adding new experience
//   const [newExperience, setNewExperience] = useState({
//     title: "",
//     company: "",
//     location: "",
//     startDate: "",
//     endDate: "",
//     current: false,
//     description: "",
//   });

//   // Form for adding new education
//   const [newEducation, setNewEducation] = useState({
//     degree: "",
//     institution: "",
//     field: "",
//     startDate: "",
//     endDate: "",
//     gpa: "",
//   });

//   // Load profile data on component mount
//   useEffect(() => {
//     if (status === "authenticated") {
//       fetchProfileData();
//     } else if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   // Fetch profile data from API
//   const fetchProfileData = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("/api/user/profile");
//       const data = await response.json();

//       if (data.success && data.profile) {
//         const user = data.profile;
//         setProfileData({
//           fullName: user.name || "",
//           email: user.email || "",
//           phone: user.profile?.phone || "",
//           location: user.profile?.location || "",
//           bio: user.profile?.bio || "",
//           skills: user.profile?.skills || [],
//           experience: user.profile?.experience || [],
//           education: user.profile?.education || [],
//           resume: user.profile?.resume || null,
//           github: user.profile?.socialLinks?.github || "",
//           linkedin: user.profile?.socialLinks?.linkedin || "",
//           portfolio: user.profile?.socialLinks?.portfolio || "",
//           profileCompletion: user.profile?.profileCompletion || 0,
//           jobsApplied: user.profile?.jobsApplied || 0,
//           interviews: user.profile?.interviews || 0,
//         });

//         // Set profile image preview
//         if (user.profile?.profileImage) {
//           setImagePreview(user.profile.profileImage);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       alert("Failed to load profile data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle profile image upload
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Create preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//     };
//     reader.readAsDataURL(file);

//     // Upload to server
//     try {
//       const formData = new FormData();
//       formData.append("image", file);
//       formData.append("type", "profile");

//       const response = await fetch("/api/user/profile/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (result.success) {
//         setProfileData((prev) => ({
//           ...prev,
//           profileCompletion: prev.profileCompletion + 5, // Update completion
//         }));
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Failed to upload image");
//     }
//   };

//   // Handle resume upload
//   const handleResumeUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setResumeFile(file);

//     // Upload to server
//     try {
//       const formData = new FormData();
//       formData.append("image", file);
//       formData.append("type", "resume");

//       const response = await fetch("/api/user/profile/upload", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (result.success) {
//         setProfileData((prev) => ({
//           ...prev,
//           resume: {
//             fileName: file.name,
//             fileData: result.dataUrl,
//             fileSize: file.size,
//             fileType: file.type,
//           },
//         }));
//       }
//     } catch (error) {
//       console.error("Error uploading resume:", error);
//       alert("Failed to upload resume");
//     }
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle skills input
//   const handleSkillsChange = (e) => {
//     const skillsArray = e.target.value
//       .split(",")
//       .map((skill) => skill.trim())
//       .filter((skill) => skill);
//     setProfileData((prev) => ({
//       ...prev,
//       skills: skillsArray,
//     }));
//   };

//   // Add experience
//   const handleAddExperience = () => {
//     if (newExperience.title && newExperience.company) {
//       setProfileData((prev) => ({
//         ...prev,
//         experience: [...prev.experience, newExperience],
//       }));
//       setNewExperience({
//         title: "",
//         company: "",
//         location: "",
//         startDate: "",
//         endDate: "",
//         current: false,
//         description: "",
//       });
//     }
//   };

//   // Remove experience
//   const handleRemoveExperience = (index) => {
//     setProfileData((prev) => ({
//       ...prev,
//       experience: prev.experience.filter((_, i) => i !== index),
//     }));
//   };

//   // Add education
//   const handleAddEducation = () => {
//     if (newEducation.degree && newEducation.institution) {
//       setProfileData((prev) => ({
//         ...prev,
//         education: [...prev.education, newEducation],
//       }));
//       setNewEducation({
//         degree: "",
//         institution: "",
//         field: "",
//         startDate: "",
//         endDate: "",
//         gpa: "",
//       });
//     }
//   };

//   // Remove education
//   const handleRemoveEducation = (index) => {
//     setProfileData((prev) => ({
//       ...prev,
//       education: prev.education.filter((_, i) => i !== index),
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       // Prepare data for API
//       const dataToSend = {
//         fullName: profileData.fullName,
//         phone: profileData.phone,
//         location: profileData.location,
//         bio: profileData.bio,
//         skills: profileData.skills,
//         experience: profileData.experience,
//         education: profileData.education,
//         github: profileData.github,
//         linkedin: profileData.linkedin,
//         portfolio: profileData.portfolio,
//         // Include profile image if it's a new base64 string
//         ...(imagePreview && imagePreview.startsWith("data:") && {
//           profileImage: imagePreview,
//         }),
//       };

//       const response = await fetch("/api/user/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       const result = await response.json();

//       if (result.success) {
//         alert("Profile updated successfully!");
//         setIsEditing(false);
//         // Refresh profile data
//         fetchProfileData();
//       } else {
//         alert(result.error || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       alert("Failed to save profile. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Remove profile image
//   const handleRemoveImage = async () => {
//     try {
//       const response = await fetch(
//         "/api/user/profile/upload?type=profile",
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();
//       if (result.success) {
//         setImagePreview("");
//         setProfileData((prev) => ({
//           ...prev,
//           profileCompletion: prev.profileCompletion - 5,
//         }));
//       }
//     } catch (error) {
//       console.error("Error removing image:", error);
//       alert("Failed to remove image");
//     }
//   };

//   // Remove resume
//   const handleRemoveResume = async () => {
//     try {
//       const response = await fetch(
//         "/api/user/profile/upload?type=resume",
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();
//       if (result.success) {
//         setResumeFile(null);
//         setProfileData((prev) => ({
//           ...prev,
//           resume: null,
//         }));
//       }
//     } catch (error) {
//       console.error("Error removing resume:", error);
//       alert("Failed to remove resume");
//     }
//   };

//   // Download resume
//   const handleDownloadResume = () => {
//     if (profileData.resume?.fileData) {
//       const link = document.createElement("a");
//       link.href = profileData.resume.fileData;
//       link.download = profileData.resume.fileName || "resume";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.spinner}></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>User Profile</h1>
//         <p style={styles.subtitle}>
//           Complete your profile to increase job opportunities
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         {/* Profile Header */}
//         <div style={styles.profileHeader}>
//           <div style={styles.avatarSection}>
//             <div style={styles.avatarContainer}>
//               {imagePreview ? (
//                 <img
//                   src={imagePreview}
//                   alt="Profile"
//                   style={styles.avatarImage}
//                 />
//               ) : (
//                 <div style={styles.avatarPlaceholder}>
//                   {profileData.fullName.charAt(0).toUpperCase() || "U"}
//                 </div>
//               )}
//               {isEditing && (
//                 <div style={styles.avatarActions}>
//                   <label style={styles.uploadButton}>
//                     Change Photo
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       style={styles.fileInput}
//                     />
//                   </label>
//                   {imagePreview && (
//                     <button
//                       type="button"
//                       onClick={handleRemoveImage}
//                       style={styles.removeButton}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div style={styles.profileStats}>
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>
//                 {profileData.jobsApplied}
//               </span>
//               <span style={styles.statLabel}>Jobs Applied</span>
//             </div>
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>
//                 {profileData.interviews}
//               </span>
//               <span style={styles.statLabel}>Interviews</span>
//             </div>
//             <div style={styles.statItem}>
//               <span style={styles.statNumber}>
//                 {profileData.profileCompletion}%
//               </span>
//               <span style={styles.statLabel}>Profile Complete</span>
//               <div style={styles.progressBar}>
//                 <div
//                   style={{
//                     ...styles.progressFill,
//                     width: `${profileData.profileCompletion}%`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div style={styles.actionButtons}>
//           {!isEditing ? (
//             <button
//               type="button"
//               onClick={() => setIsEditing(true)}
//               style={styles.editButton}
//             >
//               Edit Profile
//             </button>
//           ) : (
//             <div style={styles.editActionButtons}>
//               <button
//                 type="submit"
//                 disabled={isSaving}
//                 style={styles.saveButton}
//               >
//                 {isSaving ? "Saving..." : "Save Changes"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsEditing(false);
//                   fetchProfileData(); // Reload original data
//                 }}
//                 style={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Basic Information */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Basic Information</h2>
//           <div style={styles.formGrid}>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Full Name *</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={profileData.fullName}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 required
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Email *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={profileData.email}
//                 disabled
//                 style={{ ...styles.input, backgroundColor: "#f1f5f9" }}
//               />
//               <small style={styles.helperText}>Email cannot be changed</small>
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Phone Number</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={profileData.phone}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="+1 (123) 456-7890"
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={profileData.location}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="City, Country"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Bio */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Professional Bio</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Tell us about yourself</label>
//             <textarea
//               name="bio"
//               value={profileData.bio}
//               onChange={handleInputChange}
//               disabled={!isEditing}
//               style={styles.textarea}
//               placeholder="Describe your professional background, interests, and career goals..."
//               rows={4}
//             />
//           </div>
//         </div>

//         {/* Skills */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Skills</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>
//               Add your skills (comma separated)
//             </label>
//             <input
//               type="text"
//               value={profileData.skills.join(", ")}
//               onChange={handleSkillsChange}
//               disabled={!isEditing}
//               style={styles.input}
//               placeholder="JavaScript, React, Node.js, Python"
//             />
//             {profileData.skills.length > 0 && (
//               <div style={styles.skillsContainer}>
//                 {profileData.skills.map((skill, index) => (
//                   <span key={index} style={styles.skillTag}>
//                     {skill}
//                     {isEditing && (
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setProfileData((prev) => ({
//                             ...prev,
//                             skills: prev.skills.filter((_, i) => i !== index),
//                           }));
//                         }}
//                         style={styles.removeTagButton}
//                       >
//                         ×
//                       </button>
//                     )}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Work Experience */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Work Experience</h2>
//           {profileData.experience.length === 0 ? (
//             <p style={styles.noDataText}>No work experience added yet</p>
//           ) : (
//             profileData.experience.map((exp, index) => (
//               <div key={index} style={styles.experienceItem}>
//                 <div style={styles.experienceHeader}>
//                   <h3 style={styles.experienceTitle}>{exp.title}</h3>
//                   {isEditing && (
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveExperience(index)}
//                       style={styles.removeItemButton}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//                 <p style={styles.experienceCompany}>
//                   {exp.company} • {exp.location}
//                 </p>
//                 <p style={styles.experienceDuration}>
//                   {exp.startDate} - {exp.current ? "Present" : exp.endDate}
//                 </p>
//                 {exp.description && (
//                   <p style={styles.experienceDescription}>
//                     {exp.description}
//                   </p>
//                 )}
//               </div>
//             ))
//           )}

//           {isEditing && (
//             <div style={styles.addForm}>
//               <h3 style={styles.addFormTitle}>Add New Experience</h3>
//               <div style={styles.formGrid}>
//                 <input
//                   type="text"
//                   placeholder="Job Title *"
//                   value={newExperience.title}
//                   onChange={(e) =>
//                     setNewExperience((prev) => ({
//                       ...prev,
//                       title: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Company *"
//                   value={newExperience.company}
//                   onChange={(e) =>
//                     setNewExperience((prev) => ({
//                       ...prev,
//                       company: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Location"
//                   value={newExperience.location}
//                   onChange={(e) =>
//                     setNewExperience((prev) => ({
//                       ...prev,
//                       location: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="Start Date *"
//                   value={newExperience.startDate}
//                   onChange={(e) =>
//                     setNewExperience((prev) => ({
//                       ...prev,
//                       startDate: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="End Date"
//                   value={newExperience.endDate}
//                   onChange={(e) =>
//                     setNewExperience((prev) => ({
//                       ...prev,
//                       endDate: e.target.value,
//                     }))
//                   }
//                   disabled={newExperience.current}
//                   style={styles.input}
//                 />
//                 <label style={styles.checkboxLabel}>
//                   <input
//                     type="checkbox"
//                     checked={newExperience.current}
//                     onChange={(e) =>
//                       setNewExperience((prev) => ({
//                         ...prev,
//                         current: e.target.checked,
//                       }))
//                     }
//                     style={styles.checkbox}
//                   />
//                   Currently working here
//                 </label>
//               </div>
//               <textarea
//                 placeholder="Job Description"
//                 value={newExperience.description}
//                 onChange={(e) =>
//                   setNewExperience((prev) => ({
//                     ...prev,
//                     description: e.target.value,
//                   }))
//                 }
//                 style={styles.textarea}
//                 rows={3}
//               />
//               <button
//                 type="button"
//                 onClick={handleAddExperience}
//                 style={styles.addButton}
//                 disabled={!newExperience.title || !newExperience.company}
//               >
//                 Add Experience
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Education */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Education</h2>
//           {profileData.education.length === 0 ? (
//             <p style={styles.noDataText}>No education added yet</p>
//           ) : (
//             profileData.education.map((edu, index) => (
//               <div key={index} style={styles.educationItem}>
//                 <div style={styles.educationHeader}>
//                   <h3 style={styles.educationDegree}>
//                     {edu.degree} in {edu.field}
//                   </h3>
//                   {isEditing && (
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveEducation(index)}
//                       style={styles.removeItemButton}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//                 <p style={styles.educationInstitution}>{edu.institution}</p>
//                 <p style={styles.educationDuration}>
//                   {edu.startDate} - {edu.endDate}
//                   {edu.gpa && ` • GPA: ${edu.gpa}`}
//                 </p>
//               </div>
//             ))
//           )}

//           {isEditing && (
//             <div style={styles.addForm}>
//               <h3 style={styles.addFormTitle}>Add Education</h3>
//               <div style={styles.formGrid}>
//                 <input
//                   type="text"
//                   placeholder="Degree *"
//                   value={newEducation.degree}
//                   onChange={(e) =>
//                     setNewEducation((prev) => ({
//                       ...prev,
//                       degree: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Institution *"
//                   value={newEducation.institution}
//                   onChange={(e) =>
//                     setNewEducation((prev) => ({
//                       ...prev,
//                       institution: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Field of Study"
//                   value={newEducation.field}
//                   onChange={(e) =>
//                     setNewEducation((prev) => ({
//                       ...prev,
//                       field: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="Start Date *"
//                   value={newEducation.startDate}
//                   onChange={(e) =>
//                     setNewEducation((prev) => ({
//                       ...prev,
//                       startDate: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="month"
//                   placeholder="End Date"
//                   value={newEducation.endDate}
//                   onChange={(e) =>
//                     setNewEducation((prev) => ({
//                       ...prev,
//                       endDate: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//                 <input
//                   type="text"
//                   placeholder="GPA"
//                   value={newEducation.gpa}
//                   onChange={(e) =>
//                     setNewEducation((prev) => ({
//                       ...prev,
//                       gpa: e.target.value,
//                     }))
//                   }
//                   style={styles.input}
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={handleAddEducation}
//                 style={styles.addButton}
//                 disabled={!newEducation.degree || !newEducation.institution}
//               >
//                 Add Education
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Resume */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Resume</h2>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Upload your resume</label>
//             {profileData.resume ? (
//               <div style={styles.resumeInfo}>
//                 <div style={styles.resumeDetails}>
//                   <span style={styles.resumeIcon}>📄</span>
//                   <div>
//                     <p style={styles.resumeName}>
//                       {profileData.resume.fileName || "resume.pdf"}
//                     </p>
//                     <p style={styles.resumeSize}>
//                       {(profileData.resume.fileSize / 1024).toFixed(2)} KB
//                     </p>
//                   </div>
//                 </div>
//                 <div style={styles.resumeActions}>
//                   <button
//                     type="button"
//                     onClick={handleDownloadResume}
//                     style={styles.downloadButton}
//                   >
//                     Download
//                   </button>
//                   {isEditing && (
//                     <>
//                       <label style={styles.uploadResumeButton}>
//                         Change
//                         <input
//                           type="file"
//                           accept=".pdf,.doc,.docx"
//                           onChange={handleResumeUpload}
//                           style={styles.fileInput}
//                         />
//                       </label>
//                       <button
//                         type="button"
//                         onClick={handleRemoveResume}
//                         style={styles.removeButton}
//                       >
//                         Remove
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 {isEditing ? (
//                   <label style={styles.uploadResumeButton}>
//                     Upload Resume (PDF, DOC)
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       onChange={handleResumeUpload}
//                       style={styles.fileInput}
//                     />
//                   </label>
//                 ) : (
//                   <p style={styles.noDataText}>No resume uploaded</p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Social Links */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Social Links</h2>
//           <div style={styles.formGrid}>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>GitHub</label>
//               <input
//                 type="url"
//                 name="github"
//                 value={profileData.github}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="https://github.com/username"
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>LinkedIn</label>
//               <input
//                 type="url"
//                 name="linkedin"
//                 value={profileData.linkedin}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="https://linkedin.com/in/username"
//               />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Portfolio</label>
//               <input
//                 type="url"
//                 name="portfolio"
//                 value={profileData.portfolio}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 style={styles.input}
//                 placeholder="https://yourportfolio.com"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons at Bottom */}
//         {isEditing && (
//           <div style={styles.bottomActions}>
//             <button
//               type="submit"
//               disabled={isSaving}
//               style={styles.saveButton}
//             >
//               {isSaving ? "Saving..." : "Save All Changes"}
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setIsEditing(false);
//                 fetchProfileData();
//               }}
//               style={styles.cancelButton}
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: "1000px",
//     margin: "0 auto",
//     padding: "2rem 1rem",
//     backgroundColor: "#f8fafc",
//     minHeight: "100vh",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "100vh",
//   },
//   spinner: {
//     width: "50px",
//     height: "50px",
//     border: "5px solid #e2e8f0",
//     borderTopColor: "#3b82f6",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: "2rem",
//   },
//   title: {
//     fontSize: "2.5rem",
//     fontWeight: "bold",
//     color: "#1e293b",
//     marginBottom: "0.5rem",
//   },
//   subtitle: {
//     fontSize: "1.1rem",
//     color: "#64748b",
//   },
//   form: {
//     backgroundColor: "white",
//     borderRadius: "12px",
//     padding: "2rem",
//     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//   },
//   profileHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "2rem",
//     paddingBottom: "2rem",
//     borderBottom: "1px solid #e2e8f0",
//     flexWrap: "wrap",
//     gap: "2rem",
//   },
//   avatarSection: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1.5rem",
//   },
//   avatarContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "1rem",
//   },
//   avatarImage: {
//     width: "120px",
//     height: "120px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "4px solid #e2e8f0",
//   },
//   avatarPlaceholder: {
//     width: "120px",
//     height: "120px",
//     borderRadius: "50%",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "3rem",
//     fontWeight: "bold",
//     border: "4px solid #e2e8f0",
//   },
//   avatarActions: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.5rem",
//   },
//   uploadButton: {
//     padding: "0.5rem 1rem",
//     backgroundColor: "#f1f5f9",
//     color: "#475569",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     position: "relative",
//     overflow: "hidden",
//     textAlign: "center",
//   },
//   removeButton: {
//     padding: "0.5rem 1rem",
//     backgroundColor: "#fee2e2",
//     color: "#dc2626",
//     border: "1px solid #fecaca",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//   },
//   fileInput: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     opacity: 0,
//     cursor: "pointer",
//   },
//   profileStats: {
//     display: "flex",
//     gap: "2rem",
//     flexWrap: "wrap",
//   },
//   statItem: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "1rem",
//     backgroundColor: "#f8fafc",
//     borderRadius: "8px",
//     minWidth: "120px",
//   },
//   statNumber: {
//     fontSize: "1.5rem",
//     fontWeight: "bold",
//     color: "#3b82f6",
//   },
//   statLabel: {
//     fontSize: "0.875rem",
//     color: "#64748b",
//     marginTop: "0.25rem",
//   },
//   progressBar: {
//     width: "100%",
//     height: "6px",
//     backgroundColor: "#e2e8f0",
//     borderRadius: "3px",
//     marginTop: "0.5rem",
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     backgroundColor: "#10b981",
//     transition: "width 0.3s ease",
//   },
//   actionButtons: {
//     display: "flex",
//     justifyContent: "flex-end",
//     marginBottom: "2rem",
//   },
//   editButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     transition: "background-color 0.2s",
//   },
//   editActionButtons: {
//     display: "flex",
//     gap: "1rem",
//   },
//   saveButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#10b981",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     transition: "background-color 0.2s",
//   },
//   cancelButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#ef4444",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     transition: "background-color 0.2s",
//   },
//   section: {
//     marginBottom: "2.5rem",
//     paddingBottom: "2rem",
//     borderBottom: "1px solid #e2e8f0",
//   },
//   sectionTitle: {
//     fontSize: "1.5rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "1.5rem",
//   },
//   formGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//   },
//   formGroup: {
//     marginBottom: "1.5rem",
//   },
//   label: {
//     display: "block",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     color: "#475569",
//     marginBottom: "0.5rem",
//   },
//   input: {
//     width: "100%",
//     padding: "0.75rem 1rem",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     fontSize: "1rem",
//     color: "#1e293b",
//     backgroundColor: "white",
//     transition: "border-color 0.2s",
//   },
//   textarea: {
//     width: "100%",
//     padding: "0.75rem 1rem",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     fontSize: "1rem",
//     color: "#1e293b",
//     backgroundColor: "white",
//     fontFamily: "inherit",
//     resize: "vertical",
//     minHeight: "100px",
//   },
//   helperText: {
//     fontSize: "0.75rem",
//     color: "#64748b",
//     marginTop: "0.25rem",
//     display: "block",
//   },
//   skillsContainer: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "0.5rem",
//     marginTop: "1rem",
//   },
//   skillTag: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "0.25rem",
//     padding: "0.375rem 0.75rem",
//     backgroundColor: "#dbeafe",
//     color: "#1d4ed8",
//     borderRadius: "9999px",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//   },
//   removeTagButton: {
//     background: "none",
//     border: "none",
//     color: "#1d4ed8",
//     cursor: "pointer",
//     fontSize: "1rem",
//     padding: 0,
//     marginLeft: "0.25rem",
//   },
//   experienceItem: {
//     backgroundColor: "#f8fafc",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     marginBottom: "1rem",
//   },
//   experienceHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: "0.5rem",
//   },
//   experienceTitle: {
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "0.25rem",
//   },
//   experienceCompany: {
//     color: "#475569",
//     marginBottom: "0.25rem",
//   },
//   experienceDuration: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//     marginBottom: "0.75rem",
//   },
//   experienceDescription: {
//     color: "#475569",
//     lineHeight: "1.6",
//   },
//   removeItemButton: {
//     padding: "0.25rem 0.75rem",
//     backgroundColor: "#fee2e2",
//     color: "#dc2626",
//     border: "1px solid #fecaca",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "0.75rem",
//     fontWeight: "500",
//   },
//   addForm: {
//     backgroundColor: "#f1f5f9",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     marginTop: "1.5rem",
//   },
//   addFormTitle: {
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "1rem",
//   },
//   checkboxLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "0.875rem",
//     color: "#475569",
//     gridColumn: "span 2",
//   },
//   checkbox: {
//     width: "1rem",
//     height: "1rem",
//   },
//   addButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#3b82f6",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     marginTop: "1rem",
//   },
//   educationItem: {
//     backgroundColor: "#f8fafc",
//     padding: "1.5rem",
//     borderRadius: "8px",
//     marginBottom: "1rem",
//   },
//   educationHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: "0.5rem",
//   },
//   educationDegree: {
//     fontSize: "1.125rem",
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: "0.25rem",
//   },
//   educationInstitution: {
//     color: "#475569",
//     marginBottom: "0.25rem",
//   },
//   educationDuration: {
//     color: "#64748b",
//     fontSize: "0.875rem",
//   },
//   resumeInfo: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "1rem",
//     backgroundColor: "#f8fafc",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//   },
//   resumeDetails: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem",
//   },
//   resumeIcon: {
//     fontSize: "2rem",
//   },
//   resumeName: {
//     fontWeight: "500",
//     color: "#1e293b",
//     marginBottom: "0.25rem",
//   },
//   resumeSize: {
//     fontSize: "0.875rem",
//     color: "#64748b",
//   },
//   resumeActions: {
//     display: "flex",
//     gap: "0.5rem",
//   },
//   downloadButton: {
//     padding: "0.5rem 1rem",
//     backgroundColor: "#dbeafe",
//     color: "#1d4ed8",
//     border: "1px solid #93c5fd",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//   },
//   uploadResumeButton: {
//     padding: "0.75rem 1.5rem",
//     backgroundColor: "#f1f5f9",
//     color: "#475569",
//     border: "1px solid #cbd5e1",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     position: "relative",
//     overflow: "hidden",
//     display: "inline-block",
//   },
//   noDataText: {
//     color: "#64748b",
//     fontStyle: "italic",
//   },
//   bottomActions: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "1rem",
//     paddingTop: "2rem",
//     borderTop: "1px solid #e2e8f0",
//     marginTop: "2rem",
//   },
// };

// // Add CSS animation for spinner
// if (typeof document !== "undefined") {
//   const style = document.createElement("style");
//   style.textContent = `
//     @keyframes spin {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }
//   `;
//   document.head.appendChild(style);
// }


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    resume: null,
    github: "",
    linkedin: "",
    portfolio: "",
    profileCompletion: 0,
    jobsApplied: 0,
    interviews: 0,
  });

  // Form for adding new experience
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  // Form for adding new education
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
  });

  // Load profile data on component mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfileData();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success && data.user) {
        const user = data.user;
        setProfileData({
          fullName: user.name || "",
          email: user.email || "",
          phone: user.profile?.phone || "",
          location: user.profile?.location || "",
          bio: user.profile?.bio || "",
          skills: user.profile?.skills || [],
          experience: user.profile?.experience || [],
          education: user.profile?.education || [],
          resume: user.profile?.resume || null,
          github: user.profile?.socialLinks?.github || "",
          linkedin: user.profile?.socialLinks?.linkedin || "",
          portfolio: user.profile?.socialLinks?.portfolio || "",
          profileCompletion: user.profile?.profileCompletion || 0,
          jobsApplied: user.profile?.jobsApplied || 0,
          interviews: user.profile?.interviews || 0,
        });

        // Set profile image preview
        if (user.profile?.profileImage) {
          setImagePreview(user.profile.profileImage);
        }
      } else {
        console.error("Failed to fetch profile:", data.error);
        alert("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append("type", "profile");
      formData.append("file", file);

      const response = await fetch("/api/user/profile/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        // Update profile completion by fetching fresh data
        fetchProfileData();
        alert("Profile image uploaded successfully!");
      } else {
        alert(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append("type", "resume");
      formData.append("file", file);

      const response = await fetch("/api/user/profile/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setProfileData((prev) => ({
          ...prev,
          resume: {
            fileName: file.name,
            fileData: result.dataUrl,
            fileSize: file.size,
            fileType: file.type,
          },
        }));
        alert("Resume uploaded successfully!");
      } else {
        alert(result.error || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle skills input
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setProfileData((prev) => ({
      ...prev,
      skills: skillsArray,
    }));
  };

  // Add experience
  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      setProfileData((prev) => ({
        ...prev,
        experience: [...prev.experience, newExperience],
      }));
      setNewExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    }
  };

  // Remove experience
  const handleRemoveExperience = (index) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Add education
  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setProfileData((prev) => ({
        ...prev,
        education: [...prev.education, newEducation],
      }));
      setNewEducation({
        degree: "",
        institution: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      });
    }
  };

  // Remove education
  const handleRemoveEducation = (index) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare data for API
      const dataToSend = {
        profileData: {
          fullName: profileData.fullName,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          skills: profileData.skills,
          experience: profileData.experience,
          education: profileData.education,
          github: profileData.github,
          linkedin: profileData.linkedin,
          portfolio: profileData.portfolio,
          ...(imagePreview && imagePreview.startsWith("data:") && {
            profileImage: imagePreview,
          }),
        }
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        // Refresh profile data
        fetchProfileData();
      } else {
        alert(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Remove profile image
  const handleRemoveImage = async () => {
    try {
      const response = await fetch(
        `/api/user/profile/upload?type=profile`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (result.success) {
        setImagePreview("");
        setProfileData((prev) => ({
          ...prev,
          profileImage: null,
        }));
        alert("Profile image removed successfully!");
      } else {
        alert(result.error || "Failed to remove image");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Failed to remove image");
    }
  };

  // Remove resume
  const handleRemoveResume = async () => {
    try {
      const response = await fetch(
        `/api/user/profile/upload?type=resume`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      if (result.success) {
        setResumeFile(null);
        setProfileData((prev) => ({
          ...prev,
          resume: null,
        }));
        alert("Resume removed successfully!");
      } else {
        alert(result.error || "Failed to remove resume");
      }
    } catch (error) {
      console.error("Error removing resume:", error);
      alert("Failed to remove resume");
    }
  };

  // Download resume
  const handleDownloadResume = () => {
    if (profileData.resume?.fileData) {
      const link = document.createElement("a");
      link.href = profileData.resume.fileData;
      link.download = profileData.resume.fileName || "resume";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Profile</h1>
        <p style={styles.subtitle}>
          Complete your profile to increase job opportunities
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarContainer}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  style={styles.avatarImage}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {profileData.fullName.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              {isEditing && (
                <div style={styles.avatarActions}>
                  <label style={styles.uploadButton}>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={styles.fileInput}
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={styles.profileStats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {profileData.jobsApplied}
              </span>
              <span style={styles.statLabel}>Jobs Applied</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {profileData.interviews}
              </span>
              <span style={styles.statLabel}>Interviews</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {profileData.profileCompletion}%
              </span>
              <span style={styles.statLabel}>Profile Complete</span>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${profileData.profileCompletion}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              style={styles.editButton}
            >
              Edit Profile
            </button>
          ) : (
            <div style={styles.editActionButtons}>
              <button
                type="submit"
                disabled={isSaving}
                style={styles.saveButton}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  fetchProfileData(); // Reload original data
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                style={{ ...styles.input, backgroundColor: "#f1f5f9" }}
              />
              <small style={styles.helperText}>Email cannot be changed</small>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="+1 (123) 456-7890"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Bio</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tell us about yourself</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              style={styles.textarea}
              placeholder="Describe your professional background, interests, and career goals..."
              rows={4}
            />
          </div>
        </div>

        {/* Skills */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Add your skills (comma separated)
            </label>
            <input
              type="text"
              value={profileData.skills.join(", ")}
              onChange={handleSkillsChange}
              disabled={!isEditing}
              style={styles.input}
              placeholder="JavaScript, React, Node.js, Python"
            />
            {profileData.skills.length > 0 && (
              <div style={styles.skillsContainer}>
                {profileData.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileData((prev) => ({
                            ...prev,
                            skills: prev.skills.filter((_, i) => i !== index),
                          }));
                        }}
                        style={styles.removeTagButton}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Work Experience</h2>
          {profileData.experience.length === 0 ? (
            <p style={styles.noDataText}>No work experience added yet</p>
          ) : (
            profileData.experience.map((exp, index) => (
              <div key={index} style={styles.experienceItem}>
                <div style={styles.experienceHeader}>
                  <h3 style={styles.experienceTitle}>{exp.title}</h3>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      style={styles.removeItemButton}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p style={styles.experienceCompany}>
                  {exp.company} • {exp.location}
                </p>
                <p style={styles.experienceDuration}>
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
                {exp.description && (
                  <p style={styles.experienceDescription}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))
          )}

          {isEditing && (
            <div style={styles.addForm}>
              <h3 style={styles.addFormTitle}>Add New Experience</h3>
              <div style={styles.formGrid}>
                <input
                  type="text"
                  placeholder="Job Title *"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Company *"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newExperience.location}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="month"
                  placeholder="Start Date *"
                  value={newExperience.startDate}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="month"
                  placeholder="End Date"
                  value={newExperience.endDate}
                  onChange={(e) =>
                    setNewExperience((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  disabled={newExperience.current}
                  style={styles.input}
                />
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={newExperience.current}
                    onChange={(e) =>
                      setNewExperience((prev) => ({
                        ...prev,
                        current: e.target.checked,
                      }))
                    }
                    style={styles.checkbox}
                  />
                  Currently working here
                </label>
              </div>
              <textarea
                placeholder="Job Description"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                style={styles.textarea}
                rows={3}
              />
              <button
                type="button"
                onClick={handleAddExperience}
                style={styles.addButton}
                disabled={!newExperience.title || !newExperience.company}
              >
                Add Experience
              </button>
            </div>
          )}
        </div>

        {/* Education */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          {profileData.education.length === 0 ? (
            <p style={styles.noDataText}>No education added yet</p>
          ) : (
            profileData.education.map((edu, index) => (
              <div key={index} style={styles.educationItem}>
                <div style={styles.educationHeader}>
                  <h3 style={styles.educationDegree}>
                    {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                  </h3>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      style={styles.removeItemButton}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p style={styles.educationInstitution}>{edu.institution}</p>
                <p style={styles.educationDuration}>
                  {edu.startDate} - {edu.endDate}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))
          )}

          {isEditing && (
            <div style={styles.addForm}>
              <h3 style={styles.addFormTitle}>Add Education</h3>
              <div style={styles.formGrid}>
                <input
                  type="text"
                  placeholder="Degree *"
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      degree: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Institution *"
                  value={newEducation.institution}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      institution: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={newEducation.field}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      field: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="month"
                  placeholder="Start Date *"
                  value={newEducation.startDate}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="month"
                  placeholder="End Date"
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="GPA"
                  value={newEducation.gpa}
                  onChange={(e) =>
                    setNewEducation((prev) => ({
                      ...prev,
                      gpa: e.target.value,
                    }))
                  }
                  style={styles.input}
                />
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                style={styles.addButton}
                disabled={!newEducation.degree || !newEducation.institution}
              >
                Add Education
              </button>
            </div>
          )}
        </div>

        {/* Resume */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Resume</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Upload your resume</label>
            {profileData.resume ? (
              <div style={styles.resumeInfo}>
                <div style={styles.resumeDetails}>
                  <span style={styles.resumeIcon}>📄</span>
                  <div>
                    <p style={styles.resumeName}>
                      {profileData.resume.fileName || "resume.pdf"}
                    </p>
                    <p style={styles.resumeSize}>
                      {(profileData.resume.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div style={styles.resumeActions}>
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    style={styles.downloadButton}
                  >
                    Download
                  </button>
                  {isEditing && (
                    <>
                      <label style={styles.uploadResumeButton}>
                        Change
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          style={styles.fileInput}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {isEditing ? (
                  <label style={styles.uploadResumeButton}>
                    Upload Resume (PDF, DOC)
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={styles.fileInput}
                    />
                  </label>
                ) : (
                  <p style={styles.noDataText}>No resume uploaded</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Social Links</h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>GitHub</label>
              <input
                type="url"
                name="github"
                value={profileData.github}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="https://github.com/username"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Portfolio</label>
              <input
                type="url"
                name="portfolio"
                value={profileData.portfolio}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={styles.input}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons at Bottom */}
        {isEditing && (
          <div style={styles.bottomActions}>
            <button
              type="submit"
              disabled={isSaving}
              style={styles.saveButton}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                fetchProfileData();
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem 1rem",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
  },
  form: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  profileHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "2rem",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
    gap: "2rem",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  avatarImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #e2e8f0",
  },
  avatarPlaceholder: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    fontWeight: "bold",
    border: "4px solid #e2e8f0",
  },
  avatarActions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  uploadButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
  },
  removeButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  fileInput: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  profileStats: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    minWidth: "120px",
  },
  statNumber: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#64748b",
    marginTop: "0.25rem",
  },
  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e2e8f0",
    borderRadius: "3px",
    marginTop: "0.5rem",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    transition: "width 0.3s ease",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "2rem",
  },
  editButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  editActionButtons: {
    display: "flex",
    gap: "1rem",
  },
  saveButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  cancelButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  section: {
    marginBottom: "2.5rem",
    paddingBottom: "2rem",
    borderBottom: "1px solid #e2e8f0",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "1.5rem",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#475569",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "#1e293b",
    backgroundColor: "white",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "#1e293b",
    backgroundColor: "white",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "100px",
  },
  helperText: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.25rem",
    display: "block",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  skillTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.375rem 0.75rem",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  removeTagButton: {
    background: "none",
    border: "none",
    color: "#1d4ed8",
    cursor: "pointer",
    fontSize: "1rem",
    padding: 0,
    marginLeft: "0.25rem",
  },
  experienceItem: {
    backgroundColor: "#f8fafc",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  experienceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.5rem",
  },
  experienceTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },
  experienceCompany: {
    color: "#475569",
    marginBottom: "0.25rem",
  },
  experienceDuration: {
    color: "#64748b",
    fontSize: "0.875rem",
    marginBottom: "0.75rem",
  },
  experienceDescription: {
    color: "#475569",
    lineHeight: "1.6",
  },
  removeItemButton: {
    padding: "0.25rem 0.75rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  addForm: {
    backgroundColor: "#f1f5f9",
    padding: "1.5rem",
    borderRadius: "8px",
    marginTop: "1.5rem",
  },
  addFormTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "1rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#475569",
    gridColumn: "span 2",
  },
  checkbox: {
    width: "1rem",
    height: "1rem",
  },
  addButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginTop: "1rem",
  },
  educationItem: {
    backgroundColor: "#f8fafc",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  educationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "0.5rem",
  },
  educationDegree: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },
  educationInstitution: {
    color: "#475569",
    marginBottom: "0.25rem",
  },
  educationDuration: {
    color: "#64748b",
    fontSize: "0.875rem",
  },
  resumeInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
  },
  resumeDetails: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  resumeIcon: {
    fontSize: "2rem",
  },
  resumeName: {
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },
  resumeSize: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  resumeActions: {
    display: "flex",
    gap: "0.5rem",
  },
  downloadButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    border: "1px solid #93c5fd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  uploadResumeButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    position: "relative",
    overflow: "hidden",
    display: "inline-block",
  },
  noDataText: {
    color: "#64748b",
    fontStyle: "italic",
  },
  bottomActions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    paddingTop: "2rem",
    borderTop: "1px solid #e2e8f0",
    marginTop: "2rem",
  },
};

// Add CSS animation for spinner
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}