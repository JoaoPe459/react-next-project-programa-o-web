'use client';

import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;


        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        const role = session?.user?.role;

        if (role === "ROLE_ADMIN") {
            router.push("/admin");
        } else if (role === "ROLE_FORNECEDOR") {
            router.push("/fornecedor");
        } else if (role === "ROLE_USUARIO") {
            router.push("/usuario");
        } else {
            // Caso alguma role inesperada apareça
            router.push("/login");
        }

    }, [status, session, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500 text-lg">Redirecionando...</p>
        </div>
    );
}
