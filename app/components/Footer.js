// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function Footer() {
//   const footerLinks = {
//     "Job Seekers": [
//       { name: "Browse Jobs", href: "/jobs" },
//       { name: "Companies", href: "/companies" },
//       { name: "Career Tips", href: "/career-tips" },
//     ],
//     "Employers": [
//       { name: "Post a Job", href: "/company/post-job" },
//       { name: "Search Candidates", href: "/company/candidates" },
//       { name: "Pricing", href: "/pricing" },
//     ],
//     "Company": [
//       { name: "About Us", href: "/about" },
//       { name: "Contact", href: "/contact" },
//       { name: "Blog", href: "/blog" },
//     ],
//     "Legal": [
//       { name: "Privacy Policy", href: "/privacy" },
//       { name: "Terms of Service", href: "/terms" },
//       { name: "Cookie Policy", href: "/cookies" },
//     ],
//   };

//   return (
//     <footer className="bg-gray-50 border-t border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Main Links Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {Object.entries(footerLinks).map(([category, links]) => (
//             <div key={category}>
//               <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
//                 {category}
//               </h3>
//               <ul className="space-y-3">
//                 {links.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Divider */}
//         <div className="mt-8 pt-8 border-t border-gray-300">
//           <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//             {/* Copyright */}
//             <div className="text-sm text-gray-600">
//               © {new Date().getFullYear()} CareerHub. All rights reserved.
//             </div>

//             {/* Legal Links */}
//             <div className="flex items-center space-x-6">
//               <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
//                 Privacy Policy
//               </Link>
//               <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
//                 Terms of Service
//               </Link>
//               <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
//                 Contact Us
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaInstagram, FaHeart } from "react-icons/fa";

export default function Footer() {
  const footerLinks = {
    "For Job Seekers": [
      { name: "Browse Jobs", href: "/jobs" },
      { name: "Companies", href: "/companies" },
      { name: "Career Tips", href: "/career-tips" },
      { name: "Resume Builder", href: "/resume-builder" },
    ],
    "For Employers": [
      { name: "Post a Job", href: "/company/post-job" },
      { name: "Search Candidates", href: "/company/candidates" },
      { name: "Pricing", href: "/pricing" },
      { name: "Hire Talent", href: "/hire" },
    ],
    "Company": [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
    ],
    "Legal": [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" },
    ],
  };

  const socialLinks = [
    { icon: <FaLinkedin />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section with logo and description */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">CH</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerHub
            </h2>
          </div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Connecting talent with opportunity. Find your dream career or the perfect candidate.
          </p>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-all duration-200 hover:translate-x-1"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              aria-label={social.label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-md transition-all duration-200"
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600 flex items-center gap-1">
              © {new Date().getFullYear()} CareerHub. All rights reserved. Muzammil Husnain
             
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Link 
                href="/privacy" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors hover:underline"
              >
                Terms
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}