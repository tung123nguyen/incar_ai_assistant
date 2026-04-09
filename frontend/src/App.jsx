import React, { useEffect } from 'react';
import ChatPanel from './components/ChatPanel';
import CarControls from './components/CarControls';
import { useStore } from './store';

function App() {
  const { startPolling } = useStore();

  useEffect(() => {
    startPolling();
  }, [startPolling]);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Abstract Background for Premium feel */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-vinfast-blue rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-vinfast-accent rounded-full mix-blend-screen filter blur-[180px] opacity-60"></div>
      </div>
      
      <div className="w-full max-w-[1300px] h-[90vh] glass-card shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden border border-white/10 ring-1 ring-white/5 bg-[#0B0F19]/60 backdrop-blur-3xl">
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center relative shadow-[inset_-20px_0_40px_rgba(0,0,0,0.2)]">
            <div className="absolute top-6 left-8 flex items-center gap-3 opacity-80">
                <div className="w-2 h-8 bg-vinfast-accent rounded-full drop-shadow-[0_0_10px_rgba(0,195,255,0.8)]"></div>
                <div>
                   <h1 className="text-xl font-bold tracking-tight">VF Virtual Cockpit</h1>
                   <p className="text-[10px] uppercase tracking-widest text-vinfast-accent font-bold">Simulator Edition</p>
                </div>
            </div>
            {/* The Car Controls */}
            <div className="w-full mt-12 md:mt-16 flex-1 max-h-full">
               <CarControls />
            </div>
        </div>
        
        {/* Chat / AI Interface section */}
        <div className="w-full h-full md:w-[420px] lg:w-[480px] bg-black/40 border-l border-white/5 flex flex-col relative z-20">
           <ChatPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
