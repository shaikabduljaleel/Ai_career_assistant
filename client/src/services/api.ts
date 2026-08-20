const API_URL=import.meta.env.VITE_API_URL;

export const api={
  getHealth:async()=>{
    const response=await fetch(`${API_URL}/health`);
    if(!response.ok){
      throw new Error("Failed to Connect to the server");
    }
    return response.json();
  }
}