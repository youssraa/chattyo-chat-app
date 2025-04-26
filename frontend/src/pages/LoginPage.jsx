import React ,{useState} from 'react'
import {Link} from "react-router-dom" ;
import { useAuthStore } from '../store/useAuthStore';
import {MessageSquare , User , Mail , Lock , Eye , EyeOff ,Loader2} from "lucide-react";
import { toast } from 'react-hot-toast';
import AuthImagePattern from "../components/AuthImagePattern";



const LoginPage = () => {
  const[showPassword , setShowPassword]= useState(false);
  const[formData , setFormData]= useState({
   email:"",
   password :""
 });

    const {logIn , isLoginingIn} = useAuthStore();
    const validateForm =()=>{
     if(!formData.email.trim()) return toast.error("Email is required !!");
     if (!formData.password) return toast.error("Password is required");
     return true ; 
   };
   const handleSubmit =(e)=>{
     e.preventDefault();
     const success = validateForm() ;
     if(success === true) logIn(formData)
       
     
   }
  return (
    <div  className="min-h-screen grid lg:grid-cols-2">
    {/* left side */}
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        {/* logo  */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
            group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Log In </h1>
            <p className="text-base-content/60">Get started with your free account</p>
          </div>
        </div>
        {/* form  */}
        <form onSubmit={handleSubmit} className="space-y-6" >     
          {/* email */}
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
              </div>
          </div>
          {/* password */}
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                   type={showPassword ? "text" : "password"}
                   className={`input input-bordered w-full pl-10`}
                   placeholder="••••••••"
                   value={formData.password}
                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                   type="button"
                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
                   onClick={() => setShowPassword(!showPassword)}
                  >
                  {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                  <Eye className="size-5 text-base-content/40" />
                  )}
                  </button>
              </div>
          </div>
          {/* subbmit button */}
          <button type="submit" className="btn btn-primary w-full" disabled={isLoginingIn}>
            {isLoginingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Log In"
            )}
          </button>

        </form>
        <div className="text-center">
          <p className="text-base-content/60">
              You don' have an account ?{" "}
              <Link to="/signup" className="link link-primary">
                  Sign up 
              </Link> 
          </p>
        </div>

      </div>
    </div> 
      {/* rigth side  */}
      <AuthImagePattern
      title="Join our community"
      subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />  
  </div>
  )
}

export default LoginPage 