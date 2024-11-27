import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddUserPage = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("active");

    // Fetch Users
    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            toast.error("Error fetching users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Add User
    const addUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/add-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, status }),
                credentials: "include",
            });
            if (res.ok) {
                toast.success("User added successfully");
                fetchUsers();
                resetForm();
            } else {
                toast.error("Failed to add user");
            }
        } catch (error) {
            toast.error("Error adding user");
        }
    };

    // Edit User
    const editUser = (user) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setStatus(user.status); // Set status for editing
    };

    // Update User
    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users/${editingUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, status }), // Include status
                credentials: "include",
            });
            if (res.ok) {
                toast.success("User updated successfully");
                fetchUsers();
                resetForm();
            } else {
                toast.error("Failed to update user");
            }
        } catch (error) {
            toast.error("Error updating user");
        }
    };

    // Reset Form
    const resetForm = () => {
        setEditingUser(null);
        setName("");
        setEmail("");
        setPassword("");
        setStatus("active");
    };

    const deleteUser = async (id) => {
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                toast.success("User deleted successfully");
                fetchUsers();
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            toast.error("Error deleting user");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">Add User</h1>
            <form onSubmit={editingUser ? updateUser : addUser} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
                {!editingUser && (
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    />
                )}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {editingUser ? "Update" : "Add"}
                </button>
                {editingUser && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                    >
                        Cancel
                    </button>
                )}
            </form>

            <ul className="mt-6 space-y-2">
                {Array.isArray(users) &&
                    users.map((user) => (
                        <li
                            key={user._id}
                            className="flex justify-between items-center border p-2 rounded"
                        >
                            <div className="flex flex-col">
                                <span>{user.name} ({user.userType})</span>
                                <span>Status: {user.status}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => editUser(user)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteUser(user._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default AddUserPage;