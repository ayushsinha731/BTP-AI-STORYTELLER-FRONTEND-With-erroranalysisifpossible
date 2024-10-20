import React, { useContext, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

function LoginForm() {
  const [signUpInfo, setLoginInfo] = useState({
    parentEmail: "",

    password: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(signUpInfo);
  };
  const { authState, toggleAuthState } = useContext(AuthContext);

  return (
    <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 mx-auto my-[80px]">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Log In
      </h2>
      <form className="space-y-4" onSubmit={handleFormSubmit}>
       

        {/* Parent Email Field */}
        <div>
          <label
            htmlFor="parentEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Parent Email
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="parentEmail"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="john@example.com"
              onChange={(e) =>
                setLoginInfo({ ...signUpInfo, parentEmail: e.target.value })
              }
            />
          </div>
        </div>

        

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
              placeholder="••••••••"
              onChange={(e) =>
                setLoginInfo({ ...signUpInfo, password: e.target.value })
              }
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </div>

        {/* Link to Login */}
        <div className="text-sm text-center">
          Don't have an account ?{" "}
          <Link
            to="/auth"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
            onClick={() => toggleAuthState()}
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
