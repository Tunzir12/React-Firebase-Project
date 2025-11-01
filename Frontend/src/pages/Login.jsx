import { useState } from "react";
import { auth } from '../../firebase_config'; 
import { signInWithEmailAndPassword ,sendPasswordResetEmail} from 'firebase/auth';

const Login = ({ onLogin }) => { 

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false); 
    const [resetEmailSent, setResetEmailSent] = useState(false); 
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setError(null); 

        if (!email || !password) {
            setError("Please enter both email and password.");
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);

            console.log("Firebase login successful. App.jsx listener will handle state and navigation.");

            if (onLogin) {
                onLogin();
            }

        } catch (firebaseError) {
            console.error("Firebase login error:", firebaseError);
            let errorMessage = "An unknown error occurred.";
            switch (firebaseError.code) {
                case 'auth/invalid-email':
                    errorMessage = 'The email address is not valid.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This user account has been disabled.';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password': 
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed login attempts. Please try again later.';
                    break;
                default:
                    errorMessage = `Login failed: ${firebaseError.message}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResetEmailSent(false);

        if (!forgotPasswordEmail) {
            setError("Please enter your email address.");
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, forgotPasswordEmail);
            setResetEmailSent(true);
            setError(null); // Clear any errors
        } catch (firebaseError) {
            console.error("Password reset error:", firebaseError);
            let errorMessage = "Failed to send reset email.";
            switch (firebaseError.code) {
                case 'auth/invalid-email':
                    errorMessage = 'The email address is not valid.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with that email address.';
                    break;
                default:
                    errorMessage = `Error: ${firebaseError.message}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {!showForgotPassword ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label htmlFor="email" className="block">
                        <span className="text-sm font-medium text-gray-700">Email</span>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                            required
                        />
                    </label>
                    <label htmlFor="password" className="block">
                        <span className="text-sm font-medium text-gray-700">Password</span>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                            required
                        />
                    </label>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading} // Disable button while loading
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="text-center">
                        <a
                            href="#" 
                            onClick={() => setShowForgotPassword(true)}
                            className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
                        >
                            Forgot password?
                        </a>
                    </div>
                    
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register here
                        </a>
                    </p>
                </form>
                                ) : (
                    
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <label htmlFor="forgotPasswordEmail" className="block">
                            <span className="text-sm font-medium text-gray-700">Email</span>
                            <input
                                type="email"
                                id="forgotPasswordEmail"
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                                required
                            />
                        </label>

                        {resetEmailSent && (
                            <p className="text-green-600 text-sm">
                                If an account exists for {forgotPasswordEmail}, a password reset email has been sent! Check your inbox.
                            </p>
                        )}
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Sending link...' : 'Send Password Reset Email'}
                        </button>
                        <div className="text-center">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setShowForgotPassword(false); setError(null); setResetEmailSent(false); }}
                                className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
                            >
                                Back to login
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
export default Login;
