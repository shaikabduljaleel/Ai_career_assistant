export const getHealthStatus=()=>{
  return {
    status: "ok",
    message:"server is running",
    timestamp: new Date().toISOString()
  }
}