import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";
import { ClipLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    checkUser();

    const { subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="flex h-[calc(100vh-132px)] w-[80vw] items-center justify-center gap-4 text-[#00C9A7]">
        <ClipLoader color="#00C9A7" size={45} speedMultiplier={1.2} />
        <p className="text-lg font-medium">Loading...</p>
      </main>
    );
  }

  return user ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;
