import {createContext,useContext,useEffect,useState,type ReactNode,}from "react"

interface User{
  id:number;
  name:string;
  email:string;
  googleId:string|null;
  isEmailVerified:boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<string | null>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;

  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext=createContext<AuthContextType| undefined>(undefined);

const API_URL=import.meta.env.VITE_API_URL;

export const AuthProvider=({
  children ,
}:{children:ReactNode})=>{
  const [user,setUser]=useState<User | null>(null);
  const [loading,setLoading]=useState(true);
  const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return data.message ?? "Registration failed";
  }

  return null;
};
  const login=async(email:string,password:string)=>{
    const response=await fetch(`${API_URL}/auth/login`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify({email,password}),
    });
    const data=await response.json();
    if(!response.ok){
      return data.message ?? "Login failed";
    }
    setUser(data.data ?? null);
    return null;
  };
  const refreshUser=async()=>{
    try{
      const response=await fetch(`${API_URL}/auth/me`,{credentials:"include"})
      if(!response.ok){
        setUser(null);
        return ;
      }
      const data=await response.json();
      setUser(data.data ?? null);
    }catch(error){
      console.error("Failed to fetch current user:",error)
      setUser(null)
    }finally{
      setLoading(false);
    }
  }
  const logout=async()=>{
    try{
      await fetch(`${API_URL}/auth/logout`,{method:"POST",credentials:"include"});
      setUser(null)
    }catch(error){
      console.error("Logout failed:",error);
    }
  }
  useEffect(()=>{
    refreshUser();
  },[])

  return (
    <AuthContext.Provider value={{user,loading,login,register,refreshUser,logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=>{
  const context=useContext(AuthContext);
  if(!context){
    throw new Error(
      "useAuth must be used within an AuthProvider"
    )
  }
  return context;
}