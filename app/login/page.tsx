"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { FileText } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row w-full bg-white">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-2/5 xl:w-1/2 flex-col justify-center items-center bg-[#1E3A8A] md:p-10 xl:p-12 text-white relative overflow-hidden min-h-[300px]">
        <div className="z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <FileText weight="fill" className="text-[#1E3A8A] text-3xl" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Ajaia Docs</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Write together.<br />Ship faster.</h1>
          <p className="text-blue-200 text-lg">The collaborative space for modern teams to create beautiful documentation.</p>
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>
      
      {/* Right Panel */}
      <div className="flex-1 bg-[#F5F6FA] flex items-center justify-center p-6 md:p-8 xl:p-12 min-h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 xl:p-10 w-full max-w-sm md:max-w-md">
          {/* Mobile Brand Bar */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText weight="fill" className="text-white text-lg" />
            </div>
            <span className="text-lg font-bold text-gray-900">Ajaia Docs</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Welcome Back</h2>
            <p className="text-[#6B7280]">Please enter your details to sign in</p>
          </div>
          
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#4F6EF7] transition-all" 
                style={{ borderRadius: '8px' }}
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#6B7280] mb-1.5">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#4F6EF7] transition-all" 
                style={{ borderRadius: '8px' }}
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[#E5E7EB] text-[#4F6EF7] focus:ring-[#4F6EF7]" />
                <label htmlFor="remember" className="text-sm text-[#6B7280]">Remember me</label>
              </div>
              <Link href="#" className="text-sm font-medium text-[#4F6EF7] hover:underline">Forgot password?</Link>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#4F6EF7] text-white py-3 font-semibold hover:bg-opacity-90 transition-all disabled:opacity-70"
              style={{ borderRadius: '6px' }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-[#6B7280]">or</span></div>
            </div>
            
            <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border border-[#E5E7EB] hover:bg-gray-50 transition-all font-medium text-[#111827]" style={{ borderRadius: '6px' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.9 0 3.51.64 4.86 1.91l3.64-3.64C18.29 1.19 15.38 0 12 0 7.31 0 3.32 2.69 1.41 6.6l4.27 3.31C6.69 7.15 9.12 5.04 12 5.04z"></path>
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34h-11.29v4.43h6.35c-.27 1.42-1.07 2.63-2.27 3.44l3.63 2.82c2.13-1.97 3.78-4.87 3.78-8.35z"></path>
                  <path fill="#FBBC05" d="M5.68 14.71c-.24-.72-.37-1.48-.37-2.27s.13-1.55.37-2.27L1.41 6.86C.51 8.65 0 10.27 0 12.27s.51 3.62 1.41 5.41l4.27-2.97z"></path>
                  <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.63-2.82c-1.1.74-2.51 1.18-4.32 1.18-2.88 0-5.31-2.11-6.18-4.94l-4.27 2.97C3.32 21.31 7.31 24 12 24z"></path>
              </svg>
              Continue with Google
            </button>
          </form>
          
          <p className="text-center mt-8 text-[#6B7280] text-sm">
            Don't have an account? <Link href="/signup" className="text-[#4F6EF7] font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
