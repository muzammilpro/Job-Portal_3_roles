"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const handleRoleUpdate = async () => {
            if (status === "loading") return;

            // Check if there's a pending role in sessionStorage
            const pendingRole = window.sessionStorage.getItem('pendingRole');

            if (pendingRole && session?.user?.email) {
                // Update user role if needed
                try {
                    const res = await fetch('/api/user/update-role', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: pendingRole })
                    });

                    if (res.ok) {
                        // Clear the pending role
                        window.sessionStorage.removeItem('pendingRole');

                        // Force session refresh by signing out and back in
                        window.location.href = "/";
                    } else {
                        console.error('Failed to update role');
                        router.push("/");
                    }
                } catch (error) {
                    console.error('Error updating role:', error);
                    router.push("/");
                }
            } else {
                // No pending role, just redirect to home
                router.push("/");
            }
        };

        handleRoleUpdate();
    }, [session, status, router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
            <h2>Setting up your account...</h2>
            <p>Please wait while we complete your registration.</p>
        </div>
    );
}
