"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { github } from "@/lib/api";

function GithubCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
            setError("Missing authorization code or state.");
            return;
        }

        const completeAuth = async () => {
            try {
                await github.completeCallback(code, state);

                // Redirect back to connect page on success
                router.push("/");
            } catch (err) {
                console.error("Auth error:", err);
                setError(err instanceof Error ? err.message : "Failed to complete authentication");
            }
        };

        completeAuth();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Return to Connect
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Completing GitHub authentication...</p>
        </div>
    );
}

export default function GithubCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
            </div>
        }>
            <GithubCallbackContent />
        </Suspense>
    );
}
