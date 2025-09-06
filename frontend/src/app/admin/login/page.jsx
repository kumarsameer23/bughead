// File: frontend/src/app/admin/login/page.jsx
"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { DotWave } from "ldrs/react";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, UserCog } from "lucide-react";
import Link from "next/link";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import Navbar from "../../../components/Navbar";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const AdminLoginForm = () => {
  const [passwordHidden, setPasswordHidden] = useState(true);

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/login", {
          email: values.email,
          password: values.password,
        });
        toast.success("Admin login successful! 🎉");
        resetForm();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Admin login failed. Please try again. ❌"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/google-auth", {
          token: tokenResponse.access_token,
        });
        console.log("Admin Google login success:", res.data);
        toast.success("Admin Google sign-in successful! ✅");
      } catch (err) {
        toast.error("Admin Google sign-in failed. ❌");
      }
    },
    onError: () => toast.error("Admin Google sign-in failed. ❌"),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-950 relative overflow-hidden">
      <Navbar />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-md w-full backdrop-blur-md bg-neutral-900/80 border border-neutral-800 rounded-xl shadow-2xl animate-fade-in-up mt-20">
        <div className="p-4 sm:p-7">
          <div className="text-center mb-6">
            <UserCog size={48} className="mx-auto mb-2 text-emerald-500" />
            <h1 className="block text-2xl font-bold text-white">
              Admin Sign In
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Not an admin?{" "}
              <Link href="/login">
                <span className="text-blue-500 decoration-2 hover:underline font-medium cursor-pointer">
                  User sign in here
                </span>
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => googleLogin()}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-700 bg-neutral-800 text-white shadow-sm hover:bg-neutral-700 transition-colors"
            >
              <svg
                className="w-4 h-auto"
                width="46"
                height="47"
                viewBox="0 0 46 47"
                fill="none"
              >
                <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4" />
                <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853" />
                <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05" />
                <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335" />
              </svg>
              Sign in with Google
            </button>
            <div className="py-3 flex items-center text-xs text-neutral-500 uppercase before:flex-1 before:border-t before:border-neutral-700 before:me-6 after:flex-1 after:border-t after:border-neutral-700 after:ms-6">
              Or
            </div>
            <form onSubmit={loginForm.handleSubmit} noValidate>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 text-white">Email address</label>
                  <input type="email" id="email" name="email" onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} value={loginForm.values.email} className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm mb-2 text-white">Password</label>
                  <div className="relative">
                    <input type={passwordHidden ? "password" : "text"} id="password" name="password" onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} value={loginForm.values.password} className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" autoComplete="current-password" />
                    <button type="button" onClick={() => setPasswordHidden(!passwordHidden)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      {passwordHidden ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {loginForm.touched.password && loginForm.errors.password && (<p className="text-xs text-red-500 mt-2">{loginForm.errors.password}</p>)}
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-neutral-400">
                    <input type="checkbox" id="remember" name="remember" onChange={loginForm.handleChange} checked={loginForm.values.remember} className="shrink-0 mt-0.5 border-neutral-700 rounded-sm text-blue-500 bg-neutral-800 focus:ring-blue-500" />
                    Remember me
                  </label>
                  <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <button disabled={loginForm.isSubmitting} type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none shadow-sm">
                  {loginForm.isSubmitting ? (<DotWave size="35" speed="1" color="white" />) : ("Sign In")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AdminLoginForm />
    </GoogleOAuthProvider>
  );
};
export default AdminLogin;
