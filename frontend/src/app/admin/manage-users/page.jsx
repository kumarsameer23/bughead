// File: frontend/src/app/admin/manage-users/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bug, Edit, Trash2, X, Check, Eye, EyeOff, ExternalLink, LogOut } from "lucide-react"; // ✅ Imported LogOut icon
import toast, { Toaster } from "react-hot-toast";
import { DotWave } from "ldrs/react";
import Navbar from "../../../components/Navbar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Function to fetch all users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
        toast.error("You are not authorized to view this page.");
        setTimeout(() => window.location.href = "/login", 1500); // ✅ Redirect to login after a delay
        setLoading(false);
        return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users. ❌");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes for the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle the start of the edit process
  const startEdit = (user) => {
    setEditingUser(user._id);
    setEditFormData({ name: user.name, email: user.email, password: "" });
  };

  // Handle the submission of the update form
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
        toast.error("You are not authorized to perform this action.");
        return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/users/${editingUser}`, editFormData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      toast.success("User updated successfully! ✅");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user. ❌");
      console.error("Error updating user:", err);
    }
  };

  // Handle the deletion of a user
  const handleDelete = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
        toast.error("You are not authorized to perform this action.");
        return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${deletingUser}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      toast.success("User deleted successfully! ✅");
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user. ❌");
      console.error("Error deleting user:", err);
    }
  };
  
  // ✅ New function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove userId as well
    toast.success("Logged out successfully.");
    setTimeout(() => window.location.href = "/", 1000);
  };

  // Conditionally render the login redirect message
  if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-neutral-950 text-neutral-200 font-sans">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-neutral-400 mt-2">Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950">
        <DotWave size="47" speed="1" color="#2563EB" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-neutral-950 text-neutral-200 font-sans relative">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} /> {/* ✅ Added duration to toasts */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="flex items-center justify-between gap-4 mb-8"> {/* ✅ Added justify-between for logout button */}
          <div className="flex items-center gap-4">
            <Bug size={48} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-white">
              Manage Users
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-lg font-semibold text-neutral-200 bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {users.length > 0 ? (
          <div className="bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-neutral-800">
            <table className="min-w-full divide-y divide-neutral-700">
              <thead className="bg-neutral-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-neutral-900 divide-y divide-neutral-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-neutral-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEdit(user)}
                        className="text-blue-500 hover:text-blue-400 mr-4"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => setDeletingUser(user._id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-neutral-400 mt-10">
            No users found.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4">
          <div className="bg-neutral-800 rounded-lg p-6 shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-white">
              Edit User
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm mb-2 text-neutral-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-neutral-700 rounded bg-neutral-700 text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2 text-neutral-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-neutral-700 rounded bg-neutral-700 text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2 text-neutral-300">New Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "password" : "text"}
                    name="password"
                    value={editFormData.password}
                    onChange={handleEditChange}
                    className="w-full p-2 pr-10 border border-neutral-700 rounded bg-neutral-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400"
                  >
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2 px-4 rounded font-semibold text-neutral-200 bg-neutral-700 hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={false}
                  className="py-2 px-4 rounded font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4">
          <div className="bg-neutral-800 rounded-lg p-6 shadow-xl w-full max-w-xs text-center">
            <h2 className="text-lg font-bold mb-4 text-white">
              Are you sure?
            </h2>
            <p className="text-neutral-400 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingUser(null)}
                className="py-2 px-4 rounded font-semibold text-neutral-200 bg-neutral-700 hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-4 rounded font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
