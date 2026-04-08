import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff } from 'lucide-react'; 
import PageTransition from '../components/PageTransition';

const ADMIN_EMAIL = 'syllabusspineadmins@gmail.com'; 

const LoginPage = () => {
    // 1. STATE HOOKS (Now with separate loading states!)
    const [isSignUp, setIsSignUp] = useState(false); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Split the loading states so they don't confuse each other
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    if (!motion) return null;

    // 2. GOOGLE AUTH HANDLER
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true); // Trigger the Google spinner
        setMessage({ type: '', text: '' });

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Point it straight to the command center
                redirectTo: `${window.location.origin}/admin-control` 
            }
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
            setIsGoogleLoading(false); // Stop spinning if it fails
        }
        // Notice we don't set it to false on success, because the page will redirect!
    };

    // 3. EMAIL/PASSWORD HANDLER
    const handleAuth = async (e) => {
        e.preventDefault();
        setIsEmailLoading(true); // Trigger the Email spinner
        setMessage({ type: '', text: '' });

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;

                if (data.session) {
                    navigate('/student-dashboard');
                } else {
                    setMessage({
                        type: 'success',
                        text: 'Check your email! You need to click the confirmation link before you can enter.'
                    });
                    setIsSignUp(false); 
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                if (data.user.email === ADMIN_EMAIL) {
                    navigate('/admin-control');
                } else {
                    navigate('/student-dashboard');
                }
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsEmailLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 md:p-12"
                >

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white text-3xl font-black mb-6 shadow-lg shadow-blue-200">
                            S
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">
                            {isSignUp ? 'Join the Spine' : 'Welcome Back'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isSignUp ? 'Create your student account today.' : 'Sign in to access your library.'}
                        </p>
                    </div>

                    {/* Feedback Message */}
                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* GOOGLE BUTTON */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        type="button"
                        disabled={isGoogleLoading || isEmailLoading}
                        className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 mb-6"
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="animate-spin text-slate-400" size={24} />
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    <path fill="none" d="M1 1h22v22H1z" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </motion.button>

                    {/* DIVIDER */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Or with email</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* EMAIL & PASSWORD FORM */}
                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-semibold pr-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isEmailLoading || isGoogleLoading}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-600 shadow-lg transition-all disabled:opacity-50 mt-2"
                        >
                            {isEmailLoading ? <Loader2 className="animate-spin mx-auto" size={24} /> : (isSignUp ? 'Create Account' : 'Sign In')}
                        </motion.button>
                    </form>

                    {/* The Toggle Link */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "New student? Create an account"}
                        </button>
                    </div>

                </motion.div>
            </div>
        </PageTransition>
    );
};

export default LoginPage;