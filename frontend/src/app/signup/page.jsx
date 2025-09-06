// File: frontend/src/app/signup/page.jsx
"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DotWave } from "ldrs/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Bug } from "lucide-react";
import Link from "next/link";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import Navbar from "../../components/Navbar";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is Invalid"),
  password: Yup.string()
    .required("Password is required")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain a uppercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[\W]/, "Must contain a special character"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

const SignupForm = () => {
  const [passwordHidden, setPasswordHidden] = useState(true);

  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await axios.post("http://localhost:5000/user/signup", {
          name: values.name,
          email: values.email,
          password: values.password,
        });
        toast.success("User registered successfully ✅");
        resetForm();
        window.location.href = "/login";
      } catch (err) {
        toast.error(
          err.response?.data?.message || "User registration failed ❌"
        );
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema: SignupSchema,
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/google-auth", { token: tokenResponse.access_token });
        console.log("Google Sign-up success:", res.data);
        toast.success("Google sign-in successful! ✅");
        window.location.href = "/user/dashboard";
      } catch (err) {
        toast.error("Google sign-in failed. ❌");
      }
    },
    onError: () => toast.error("Google sign-in failed. ❌"),
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-950 relative overflow-hidden">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-md w-full backdrop-blur-md bg-neutral-900/80 border border-neutral-800 rounded-xl shadow-2xl animate-fade-in-up mt-20">
        <div className="p-4 sm:p-7">
          <div className="text-center mb-6">
            <Bug size={48} className="mx-auto mb-2 text-blue-500" />
            <h1 className="block text-2xl font-bold text-white">
              Create a BugHead Account
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-blue-500 decoration-2 hover:underline font-medium cursor-pointer">
                  Sign in here
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
              Sign up with Google
            </button>
            <div className="py-3 flex items-center text-xs text-neutral-500 uppercase before:flex-1 before:border-t before:border-neutral-700 before:me-6 after:flex-1 after:border-t after:border-neutral-700 after:ms-6">
              Or
            </div>
            <form onSubmit={signupForm.handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2 text-white">Full Name</label>
                  <input type="text" id="name" onChange={signupForm.handleChange} value={signupForm.values.name} className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                  {signupForm.errors.name && signupForm.touched.name && (<p className="text-xs text-red-500 mt-2">{signupForm.errors.name}</p>)}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 text-white">Email address</label>
                  <input type="email" id="email" onChange={signupForm.handleChange} value={signupForm.values.email} className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                  {signupForm.errors.email && signupForm.touched.email && (<p className="text-xs text-red-500 mt-2">{signupForm.errors.email}</p>)}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm mb-2 text-white">Password</label>
                  <div className="relative">
                    <input type={passwordHidden ? "password" : "text"} id="password" onChange={signupForm.handleChange} value={signupForm.values.password} className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                    <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400" type="button" onClick={() => setPasswordHidden(!passwordHidden)}>
                      {passwordHidden ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {signupForm.errors.password && signupForm.touched.password && (<p className="text-xs text-red-500 mt-2">{signupForm.errors.password}</p>)}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm mb-2 text-white">Confirm Password</label>
                  <input type={passwordHidden ? "password" : "text"} id="confirmPassword" onChange={signupForm.handleChange} value={signupForm.values.confirmPassword} className="py-2.5 sm:py-3 px-4 block w-full border-neutral-700 rounded-lg text-sm bg-neutral-800 text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                  {signupForm.errors.confirmPassword && signupForm.touched.confirmPassword && (<p className="text-xs text-red-500 mt-2">{signupForm.errors.confirmPassword}</p>)}
                </div>
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="shrink-0 mt-0.5 border-neutral-700 rounded-sm text-blue-500 bg-neutral-800 focus:ring-blue-500" />
                  <label htmlFor="remember-me" className="ms-3 text-sm text-neutral-400">
                    I accept the{" "}
                    <a className="text-blue-500 decoration-2 hover:underline font-medium" href="#">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <button disabled={signupForm.isSubmitting} type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none shadow-sm">
                  {signupForm.isSubmitting ? (<DotWave size="35" speed="1" color="white" />) : ("Sign Up")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUp = () => {
  const GOOGLE_CLIENT_ID = "704395928968-n2q5amv4r80mh2mrvkdvo13i62jb2cr2.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SignupForm />
    </GoogleOAuthProvider>
  );
};
export default SignUp;



// 704395928968-n2q5amv4r80mh2mrvkdvo13i62jb2cr2.apps.googleusercontent.com