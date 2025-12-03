import React, { useState } from 'react';
import { useDispatch, authActions } from '../store/index';
import { ApiCall } from '../api/apiCall';
import { ArrowRight, GraduationCap } from 'lucide-react';

export const Login = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    userID: '',
    password: '',
    loginAs: '',
    rememberMe: false
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.userID || !input.password || !input.loginAs) {
      alert("Please fill all fields");
      return;
    }

    const response = await ApiCall({
      params: { ...input },
      route: "login",
      verb: "post",
      baseurl: true
    });

    if (response.status === 200) {
      const payload = {
        ...input,
        token: response.response.token,
        user_id: response.response.user_id,
        userName: response.response.userName,
      };

      dispatch(authActions.login(payload));
      
      localStorage.setItem("token", response.response.token);
      localStorage.setItem("user_id", response.response.user_id);
      localStorage.setItem("userName", response.response.userName);
      localStorage.setItem("loginAs", input.loginAs);
      localStorage.setItem("userID", input.userID);
    } else {
      alert(response.response.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="mb-8 text-center">
         <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-white">
            <GraduationCap size={32} />
         </div>
         <h1 className="text-3xl font-bold text-indigo-900">Arsi University</h1>
         <p className="text-slate-500">FYP & Thesis Management System</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Sign In to Your Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Login As</label>
            <select 
              name="loginAs" 
              value={input.loginAs} 
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">User ID / Roll No</label>
            <input 
              type="text" 
              name="userID"
              value={input.userID}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. admin or ugr/1234/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              value={input.password}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={input.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            Login <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-center text-slate-400 bg-slate-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <div className="space-y-1">
            <p><span className="font-mono text-indigo-600">admin</span> / <span className="font-mono">admin</span> (Role: Admin)</p>
            <p><span className="font-mono text-indigo-600">any</span> / <span className="font-mono">any</span> (Role: Student)</p>
            <p><span className="font-mono text-indigo-600">any</span> / <span className="font-mono">any</span> (Role: Teacher)</p>
          </div>
        </div>
      </div>
    </div>
  );
};