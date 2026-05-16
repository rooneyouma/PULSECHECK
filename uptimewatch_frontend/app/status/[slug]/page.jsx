"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import StatusDot from "@/components/StatusDot";
import UptimeBar from "@/components/UptimeChart";

export default function StatusPage() {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: [`/status/${slug}/`],
    enabled: !!slug,
    refetchInterval: 10000, 
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#070b14", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace" }}>
        <span style={{ fontSize: "12px", color: "#4a5568", letterSpacing: "0.1em" }}>LOADING STATUS ENGINE...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ minHeight: "100vh", background: "#070b14", color: "#ff3b5c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", flexDirection: "column", gap: "10px" }}>
        <span style={{ fontSize: "12px", letterSpacing: "0.1em" }}>FAILED TO CONNECT TO MAIN ENGINE</span>
        <span style={{ fontSize: "10px", color: "#4a5568" }}>THIS MONITOR MIGHT NOT EXIST</span>
      </div>
    );
  }

  // Handle case where object is successfully requested but returns structure without fields
  if (!data) return null;

  const isUp = data.is_up;
  const siteName = data.site_name;
  
  // Format uptime_history objects into binary array for UptimeBar component
  // which expects [1, 0, 1, 1...] where 1 is up.
  // data.uptime_history is array of { status: 'up'/'down', response_time, checked_at }
  // we want reversed because it's ordered by '-checked_at', meaning newest first, but UptimeBar usually expects chronological (left to right -> oldest to newest).
  const extractedHistory = data.uptime_history 
    ? [...data.uptime_history].reverse().map(h => h.status === 'up' ? 1 : 0)
    : [];

  const downtimeCount = data.uptime_history 
    ? data.uptime_history.filter(h => h.status !== 'up').length
    : 0;
  
  const uptimeScore = data.uptime_history && data.uptime_history.length > 0
    ? (((data.uptime_history.length - downtimeCount) / data.uptime_history.length) * 100).toFixed(2)
    : "100.00";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070b14",
      color: "#e2e8f0",
      fontFamily: "'DM Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070b14; }
        ::-webkit-scrollbar-thumb { background: #1a1f2e; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1a1f2e",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "56px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", fontWeight: "500", letterSpacing: "0.15em", color: "#e2e8f0", cursor: "pointer" }} onClick={() => router.push('/')}>
            PULSECHECK
          </span>
          <span style={{ color: "#4a5568" }}>/</span>
          <span style={{ fontSize: "13px", color: "#4a5568", letterSpacing: "0.08em" }}>{slug}</span>
        </div>
      </div>

      <div style={{ padding: "48px 32px", maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Main Status Header */}
        <div style={{
          background: isUp ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 59, 92, 0.05)", 
          border: `1px solid ${isUp ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 59, 92, 0.2)'}`,
          borderRadius: "12px", padding: "40px 32px", marginBottom: "40px",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
        }}>
          <StatusDot status={isUp ? "up" : "down"} />
          <h1 style={{ 
            fontSize: "36px", 
            fontFamily: "'Syne', sans-serif", 
            marginTop: "20px", 
            marginBottom: "8px",
            color: isUp ? "#00ff88" : "#ff3b5c"
          }}>
            {isUp ? "ALL SYSTEMS OPERATIONAL" : "SERVICE OUTAGE DETECTED"}
          </h1>
          <p style={{ fontSize: "14px", color: "#4a5568", letterSpacing: "0.05em" }}>
            Monitoring {siteName} at {new Date().toLocaleTimeString("en-GB")}
          </p>
        </div>

        {/* Detailed Metrics */}
        <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
          <div style={{
            background: "#0a0e1a", border: "1px solid #1a1f2e",
            borderRadius: "10px", padding: "24px",
          }}>
            <div style={{ fontSize: "11px", color: "#4a5568", letterSpacing: "0.1em", marginBottom: "8px" }}>
              OVERALL UPTIME
            </div>
            <div style={{ fontSize: "32px", fontWeight: "500", color: "#00ff88", fontFamily: "'Syne', sans-serif" }}>
              {uptimeScore}%
            </div>
          </div>
          
          <div style={{
            background: "#0a0e1a", border: "1px solid #1a1f2e",
            borderRadius: "10px", padding: "24px",
          }}>
            <div style={{ fontSize: "11px", color: "#4a5568", letterSpacing: "0.1em", marginBottom: "8px" }}>
              LAST CHECK INTERVAL
            </div>
            <div style={{ fontSize: "32px", fontWeight: "500", color: "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>
              {data.last_checked ? new Date(data.last_checked).toLocaleString("en-GB", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "PENDING"}
            </div>
          </div>
        </div>

        {/* Uptime History Bar */}
        <div style={{
          background: "#0a0e1a", border: "1px solid #1a1f2e",
          borderRadius: "10px", padding: "32px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.1em", color: "#e2e8f0" }}>RECENT CHECK HISTORY</span>
            <span style={{ fontSize: "11px", color: "#4a5568" }}>Last 20 checks</span>
          </div>
          <div style={{ height: "40px", marginBottom: "16px" }}>
             <UptimeBar history={extractedHistory} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em" }}>OLDER</span>
            <span style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em" }}>NOW</span>
          </div>
        </div>

      </div>
    </div>
  );
}
