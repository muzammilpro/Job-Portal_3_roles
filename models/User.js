
// import mongoose from "mongoose";

// // Experience Sub-Schema
// const experienceSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   company: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   location: {
//     type: String,
//     trim: true
//   },
//   startDate: {
//     type: String,
//     required: true
//   },
//   endDate: {
//     type: String
//   },
//   current: {
//     type: Boolean,
//     default: false
//   },
//   description: {
//     type: String,
//     trim: true
//   }
// }, { _id: true });

// // Education Sub-Schema
// const educationSchema = new mongoose.Schema({
//   degree: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   institution: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   field: {
//     type: String,
//     trim: true
//   },
//   startDate: {
//     type: String,
//     required: true
//   },
//   endDate: {
//     type: String
//   },
//   gpa: {
//     type: String,
//     trim: true
//   }
// }, { _id: true });

// // Resume Sub-Schema
// const resumeSchema = new mongoose.Schema({
//   fileName: String,
//   fileData: String, // Base64 string
//   fileSize: Number,
//   fileType: String
// });

// // Social Links Sub-Schema
// const socialLinksSchema = new mongoose.Schema({
//   github: {
//     type: String,
//     trim: true
//   },
//   linkedin: {
//     type: String,
//     trim: true
//   },
//   portfolio: {
//     type: String,
//     trim: true
//   }
// });

// // Profile Sub-Schema
// const profileSchema = new mongoose.Schema({
//   phone: {
//     type: String,
//     trim: true
//   },
//   location: {
//     type: String,
//     trim: true
//   },
//   bio: {
//     type: String,
//     trim: true
//   },
//   skills: [{
//     type: String,
//     trim: true
//   }],
//   experience: [experienceSchema],
//   education: [educationSchema],
//   profileImage: {
//     type: String, // Base64 string
//     default: null
//   },
//   resume: resumeSchema,
//   socialLinks: socialLinksSchema,
//   profileCompletion: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   jobsApplied: {
//     type: Number,
//     default: 0
//   },
//   interviews: {
//     type: Number,
//     default: 0
//   }
// });

// // Main User Schema
// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["admin", "company", "applicant"],
//       default: "applicant",
//     },

//     // ✅ COMPANY STATUS (IMPORTANT) - Only relevant for companies
//     companyStatus: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },

//     // ✅ Company public profile fields (used when role === 'company')
//     description: {
//       type: String,
//       trim: true,
//     },
//     industry: {
//       type: String,
//       trim: true,
//     },
//     size: {
//       type: String,
//       trim: true,
//     },
//     website: {
//       type: String,
//       trim: true,
//     },

//     // ✅ User Profile Data
//     profile: {
//       type: profileSchema,
//       default: () => ({}) // Initialize empty profile
//     }
//   },
//   { timestamps: true }
// );

// // Calculate profile completion percentage
// UserSchema.methods.calculateProfileCompletion = function() {
//   if (!this.profile) {
//     this.profile = {};
//   }

//   let completion = 0;
//   const fields = [
//     { field: this.name, weight: 10 },
//     { field: this.email, weight: 10 },
//     { field: this.profile.phone, weight: 10 },
//     { field: this.profile.location, weight: 10 },
//     { field: this.profile.bio, weight: 15 },
//     { field: this.profile.skills, weight: 15, isArray: true },
//     { field: this.profile.experience, weight: 15, isArray: true },
//     { field: this.profile.education, weight: 10, isArray: true },
//     { field: this.profile.profileImage, weight: 5 },
//   ];

//   fields.forEach(item => {
//     if (item.field) {
//       if (item.isArray && Array.isArray(item.field)) {
//         if (item.field.length > 0) completion += item.weight;
//       } else if (item.field.toString().trim().length > 0) {
//         completion += item.weight;
//       }
//     }
//   });

//   this.profile.profileCompletion = completion;
//   return completion;
// };

// // Increment jobs applied counter
// UserSchema.methods.incrementJobsApplied = function() {
//   if (!this.profile) {
//     this.profile = {};
//   }
//   this.profile.jobsApplied = (this.profile.jobsApplied || 0) + 1;
//   return this.save();
// };

// // Increment interviews counter
// UserSchema.methods.incrementInterviews = function() {
//   if (!this.profile) {
//     this.profile = {};
//   }
//   this.profile.interviews = (this.profile.interviews || 0) + 1;
//   return this.save();
// };

// export default mongoose.models.User || mongoose.model("User", UserSchema);



import mongoose from "mongoose";

/* ===================== SUB SCHEMAS ===================== */

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  current: { type: Boolean, default: false },
  description: String,
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  field: String,
  startDate: String,
  endDate: String,
  gpa: String,
});

const resumeSchema = new mongoose.Schema({
  fileName: String,
  fileData: String, // Base64
  fileSize: Number,
  fileType: String,
});

const socialLinksSchema = new mongoose.Schema({
  github: String,
  linkedin: String,
  portfolio: String,
});

/* ===================== PROFILE ===================== */

const profileSchema = new mongoose.Schema({
  phone: String,
  location: String,
  bio: String,
  skills: [String],
  experience: [experienceSchema],
  education: [educationSchema],
  profileImage: String, // Base64
  resume: resumeSchema,
  socialLinks: socialLinksSchema,
  profileCompletion: { type: Number, default: 0 },
  jobsApplied: { type: Number, default: 0 },
  interviews: { type: Number, default: 0 },
});

/* ===================== COMPANY PROFILE ===================== */

const companyProfileSchema = new mongoose.Schema({
  description: String,
  industry: String,
  size: String,
  website: String,
  phone: String,
  location: String,
  bio: String,

  socialLinks: socialLinksSchema,

  approvalDocument: {
    type: String, // Base64
    default: null,
  },
  approvalDocumentType: String,

  approvalDocumentStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

/* ===================== USER SCHEMA ===================== */

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },

    role: {
      type: String,
      enum: ["admin", "company", "applicant"],
      default: "applicant",
    },

    // COMPANY STATUS (ADMIN CONTROL)
    companyStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Rejection reason (populated when company is rejected)
    rejectionReason: {
      type: String,
      required: false,
    },

    // Password reset fields
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // Applicant profile
    profile: {
      type: profileSchema,
      default: () => ({}),
    },

    // Company profile
    companyProfile: {
      type: companyProfileSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
