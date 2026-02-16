// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

// export default async function AdminDashboard() {
//   const session = await getServerSession(authOptions);
//   console.log("Session=>",session)

//   if (!session || session?.user?.role !== "admin") {
//     return <h1>Access Denied</h1>;
//   }

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <p>Welcome, {session.user.name}</p>
//     </div>
//   );
// }



// app/admin/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  console.log("Session in admin page =>", session);

  // If no session, redirect to login
  if (!session) {
    redirect("/login");
  }

  // If not admin, redirect to unauthorized
  if (session?.user?.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Admin Dashboard</h1>
      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem'
      }}>
        <p style={{ fontSize: '1.125rem' }}>
          Welcome, <strong>{session.user.name}</strong>
        </p>
        <p style={{ color: '#4b5563' }}>Email: {session.user.email}</p>
        <p style={{ color: '#4b5563' }}>Role: {session.user.role}</p>
      </div>

      {/* Admin Dashboard Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Stats Cards */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>--</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Active Jobs</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>--</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Companies</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>--</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{
        marginTop: '2rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
        <p style={{ color: '#6b7280' }}>No recent activity to display</p>
      </div>
    </div>
  );
}

// Metadata for the page
export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing the platform',
};