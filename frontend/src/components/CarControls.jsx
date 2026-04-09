import React from 'react';
import { Thermometer, ThermometerSnowflake, Power, Gauge, Lightbulb, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { api } from '../api';

const CarControls = () => {
  const { carState, fetchCarState } = useStore();

  const handleToggleAC = async () => {
    await api.toggleAC(!carState.ac.is_on);
    fetchCarState();
  };

  const handleToggleLights = async () => {
    await api.toggleLights(!carState.lights.is_on);
    fetchCarState();
  };

  const handleToggleDoors = async () => {
    await api.toggleDoors(!carState.doors.is_locked);
    fetchCarState();
  };

  const handleSetACTemp = async (e) => {
    const temp = parseFloat(e.target.value);
    await api.setACTemperature(temp);
    fetchCarState();
  };

  const handleMockTire = async () => {
    // Giả lập lốp trước trái bị non
    await api.mockTiresUpdate({ front_left: 1.8 });
    fetchCarState();
  };

  // Card UI helper
  const ControlCard = ({ title, icon, isActive, onClick, children }) => (
    <div className={`glass-card p-5 transition-all duration-300 relative overflow-hidden group ${isActive ? 'bg-white/10 border-white/30' : 'bg-black/30 opacity-80'}`}>
        <div className="absolute top-0 left-0 w-1 h-full bg-vinfast-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-vinfast-blue/20 text-vinfast-accent' : 'bg-white/5 text-gray-400'}`}>
                   {icon}
                </div>
                <h3 className="font-semibold text-[15px] truncate max-w-[120px]">{title}</h3>
            </div>
            {onClick && (
              <button onClick={onClick} className={`p-2 rounded-full outline-offset-4 transition-all ${isActive ? 'bg-vinfast-blue shadow-[0_0_15px_rgba(26,76,204,0.5)]' : 'bg-white/10 hover:bg-white/20 text-white/50'}`}>
                  <Power size={18} className={isActive ? "text-white" : ""} />
              </button>
            )}
        </div>
        {children}
    </div>
  );

  const getTireColor = (press) => press < 2.1 ? 'text-red-400 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-emerald-400';

  return (
    <div className="h-full pr-2 overflow-y-auto w-full max-w-lg mx-auto flex flex-col gap-4">
      {/* AC Control */}
      <ControlCard 
        title="Climate Control" 
        icon={<ThermometerSnowflake size={22} />} 
        isActive={carState.ac.is_on} 
        onClick={handleToggleAC}
      >
        <div className="flex items-center gap-6 mt-6">
          <div className="text-4xl font-light tracking-tighter text-white">
            {carState.ac.temperature.toFixed(1)}<span className="text-2xl text-white/50">°C</span>
          </div>
          <div className="flex-1 w-full pl-2">
            <input 
              type="range" 
              min="16" max="30" step="0.5" 
              value={carState.ac.temperature} 
              onChange={handleSetACTemp}
              disabled={!carState.ac.is_on}
              className="w-full accent-vinfast-accent h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer" 
            />
            <div className="flex justify-between text-[11px] font-bold tracking-widest text-white/30 mt-2 uppercase"><span>16°C</span><span>30°C</span></div>
          </div>
        </div>
      </ControlCard>

      {/* Tires */}
      <div className="glass-card p-5 relative">
         <h3 className="flex items-center gap-2 font-semibold mb-6 text-[15px]"><Gauge size={20} className="text-gray-400 text-vinfast-accent"/> Tire System</h3>
         <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-black/40 rounded-xl relative overflow-hidden border border-white/5">
                 <div className="text-[11px] font-bold text-white/40 uppercase mb-1">Front Left</div>
                 <div className={`text-2xl ${getTireColor(carState.tires.front_left)}`}>{carState.tires.front_left}</div>
             </div>
             <div className="p-3 bg-black/40 rounded-xl relative overflow-hidden border border-white/5">
                 <div className="text-[11px] font-bold text-white/40 uppercase mb-1">Front Right</div>
                 <div className={`text-2xl ${getTireColor(carState.tires.front_right)}`}>{carState.tires.front_right}</div>
             </div>
             <div className="p-3 bg-black/40 rounded-xl relative overflow-hidden border border-white/5">
                 <div className="text-[11px] font-bold text-white/40 uppercase mb-1">Rear Left</div>
                 <div className={`text-2xl ${getTireColor(carState.tires.rear_left)}`}>{carState.tires.rear_left}</div>
             </div>
             <div className="p-3 bg-black/40 rounded-xl relative overflow-hidden border border-white/5">
                 <div className="text-[11px] font-bold text-white/40 uppercase mb-1">Rear Right</div>
                 <div className={`text-2xl ${getTireColor(carState.tires.rear_right)}`}>{carState.tires.rear_right}</div>
             </div>
         </div>
         <button onClick={handleMockTire} className="mt-5 w-full py-2.5 rounded-xl border border-dashed border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2 text-sm font-semibold transition-colors">
            <AlertTriangle size={16}/> Giả lập thủng lốp
         </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Lights */}
        <ControlCard 
          title="Vehicle Lights" 
          icon={<Lightbulb size={22} />} 
          isActive={carState.lights.is_on} 
          onClick={handleToggleLights}
        >
          <div className="mt-3 text-[13px] text-white/60">
             {carState.lights.is_on ? <span className="text-vinfast-accent font-semibold">Headlights On</span> : 'Lights Off'}
          </div>
        </ControlCard>

        {/* Doors */}
        <ControlCard 
          title="Security" 
          icon={carState.doors.is_locked ? <Lock size={22}/> : <Unlock size={22} />} 
          isActive={carState.doors.is_locked} 
          onClick={handleToggleDoors}
        >
          <div className="mt-3 text-[13px] text-white/60">
             {carState.doors.is_locked ? <span className="text-emerald-400 font-semibold">Secured</span> : <span className="text-orange-400 font-semibold">Unlocked</span>}
          </div>
        </ControlCard>
      </div>
      
      <div className="text-center mt-4">
         <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">VF Smart Cockpit System</div>
      </div>
    </div>
  );
};

export default CarControls;
