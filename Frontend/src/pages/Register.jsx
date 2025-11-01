import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

import { auth, db } from '../../firebase_config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 

const Register = () => {
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        userName: '', 
        email: '',
        password: '', 
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setError(null); 

        const { email, password, firstName, lastName, userName } = formData;

        if (!email || !password || !firstName || !lastName || !userName) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstName: firstName,
                middleName: formData.middleName, 
                lastName: lastName,
                userName: userName, 
                email: email,
                createdAt: serverTimestamp(), 
                kanbanBoards: [], 
            });

            console.log("User registered and profile saved to Firestore:", user);

            navigate('/');

        } catch (firebaseError) {
            console.error("Firebase registration error:", firebaseError);
            let errorMessage = "An unknown error occurred.";
            switch (firebaseError.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered. Try logging in.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'The email address is not valid.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'The password is too weak (should be at least 6 characters).';
                    break;
                default:
                    errorMessage = `Registration failed: ${firebaseError.message}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label htmlFor="firstName" className="block">
                        <span className="text-sm font-medium text-gray-700">First Name</span>
                        <input
                            type="text" 
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                            required
                        />
                    </label>
                    <label htmlFor="middleName" className="block">
                        <span className="text-sm font-medium text-gray-700">Middle Name (Optional)</span>
                        <input
                            type="text" 
                            id="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                        />
                    </label>
                    <label htmlFor="lastName" className="block">
                        <span className="text-sm font-medium text-gray-700">Last Name</span>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                            required
                        />
                    </label>
                    <label htmlFor="userName" className="block">
                        <span className="text-sm font-medium text-gray-700">User Name</span> 
                        <input
                            type="text" 
                            id="userName" 
                            value={formData.userName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                            required
                        />
                    </label>
                    <label htmlFor="email" className="block">
                        <span className="text-sm font-medium text-gray-700">Email</span>
                        <input
                            type="email"
                            id="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                            required
                        />
                    </label>
                    <label htmlFor="password" className="block">
                        <span className="text-sm font-medium text-gray-700">Enter Password</span>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                            required
                        />
                    </label>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Register;
