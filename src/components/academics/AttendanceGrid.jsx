import React, { useMemo } from 'react';

export default function AttendanceGrid({ attendance, onUpdate }) {
  if (!attendance) return null;

  const attended = attendance.filter(r => r?.status === 'Present').length;
  const markedTotal = attendance.filter(r => r?.status !== 'Unmarked').length;
  const currentPercent = markedTotal > 0 ? (attended / markedTotal) * 100 : 0;

  const cycleStatus = (date) => {
    const statuses = ['Unmarked', 'Present', 'Absent'];
    const index = attendance.findIndex(r => r.date === date);
    if (index === -1) return;

    const current = attendance[index].status;
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    
    const newAttendance = [...attendance];
    newAttendance[index] = { ...newAttendance[index], status: next };
    onUpdate(newAttendance);
  };

  // Group attendance by month
  const groupedByMonth = useMemo(() => {
    const months = {};
    attendance.forEach(record => {
      const date = new Date(record.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!months[monthYear]) months[monthYear] = [];
      months[monthYear].push(record);
    });
    return months;
  }, [attendance]);

  const bunkLogic = () => {
    if (currentPercent >= 75) {
      const safeToSkip = Math.floor(attended / 0.75) - markedTotal;
      return { status: 'safe', msg: `Bunk Capacity: ${safeToSkip}`, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    } else {
      const needToAttend = Math.ceil((0.75 * markedTotal - attended) / 0.25);
      return { status: 'danger', msg: `Deficit: ${needToAttend} classes`, color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    }
  };

  const logic = bunkLogic();

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Metrics Analysis</span>
          <div className="flex items-end gap-3">
            <span className={`text-5xl font-black tracking-tighter tabular-nums leading-none ${currentPercent < 75 ? 'text-red-500' : 'text-emerald-500'}`}>
              {Math.round(currentPercent)}%
            </span>
            <span className="text-sm font-black text-muted-foreground/60 mb-1">({attended}/{markedTotal})</span>
          </div>
        </div>
        <div className={`px-5 py-2.5 rounded-[18px] border text-[11px] font-black uppercase tracking-[0.15em] shadow-sm ${logic.color}`}>
          {logic.msg}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-8">
        {Object.entries(groupedByMonth).map(([month, records]) => (
          <div key={month} className="space-y-3">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">{month}</h4>
            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 gap-2.5">
              {records.map((record, i) => (
                <div
                  key={record.date}
                  onClick={() => cycleStatus(record.date)}
                  title={record.date}
                  className={`aspect-square rounded-md cursor-pointer transition-all hover:scale-110 hover:z-10 shadow-sm border ${
                    record.status === 'Present' ? 'bg-emerald-500 border-emerald-600' : 
                    record.status === 'Absent' ? 'bg-red-500 border-red-600' : 
                    'bg-secondary/40 border-border/50 hover:bg-secondary/60'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-2 pt-4 border-t border-border/20">
        <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded-md bg-secondary/40 border border-border/50" /> Unmarked</div>
        <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded-md bg-emerald-500 border-emerald-600" /> Present</div>
        <div className="flex items-center gap-2.5"><div className="w-4 h-4 rounded-md bg-red-500 border-red-600" /> Absent</div>
      </div>
    </div>
  );
}
