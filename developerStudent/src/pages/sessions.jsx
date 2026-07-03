import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faVideo,
  faUser,
  faCheckCircle,
  faComment,
  faPlusCircle,
  faArrowRight,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

export default function Sessions() {
  const { sessions, bookSession, availableSlots } = useApp();
  
  // Form states
  const [topic, setTopic] = useState('Resume Building');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [goals, setGoals] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Format availableSlots into unique dates for date picker
  const dates = React.useMemo(() => {
    if (!availableSlots || availableSlots.length === 0) return [];
    
    const uniqueDates = [...new Set(availableSlots.map(s => s.date))].sort();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    
    return uniqueDates.map(dateStr => {
      const d = new Date(dateStr);
      return {
        value: dateStr,
        day: days[d.getDay()] || 'Mon',
        date: String(d.getDate()),
        month: months[d.getMonth()] || 'June'
      };
    });
  }, [availableSlots]);

  // Handle selectedDate fallback when dates array updates
  React.useEffect(() => {
    if (dates.length > 0) {
      if (!selectedDate || !dates.some(d => d.value === selectedDate)) {
        setSelectedDate(dates[0].value);
      }
    } else {
      setSelectedDate('');
    }
  }, [dates, selectedDate]);

  // Filter time slots available for selected date
  const slotsForSelectedDate = React.useMemo(() => {
    if (!selectedDate || !availableSlots) return [];
    
    return availableSlots
      .filter(s => s.date === selectedDate)
      .map(s => {
        let period = 'Morning';
        if (s.timeSlot.includes('PM') && !s.timeSlot.startsWith('12')) {
          const hour = parseInt(s.timeSlot.split(':')[0]);
          if (hour >= 4) period = 'Evening';
          else period = 'Afternoon';
        }
        return { value: s.timeSlot, period };
      });
  }, [selectedDate, availableSlots]);

  // Handle selectedSlot fallback when slots update
  React.useEffect(() => {
    if (slotsForSelectedDate.length > 0) {
      if (!selectedSlot || !slotsForSelectedDate.some(s => s.value === selectedSlot)) {
        setSelectedSlot(slotsForSelectedDate[0].value);
      }
    } else {
      setSelectedSlot('');
    }
  }, [slotsForSelectedDate, selectedSlot]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    bookSession(topic, selectedDate, selectedSlot);
    setSuccessMessage(`Successfully booked your 1-on-1 ${topic} session! Check Upcoming Sessions below.`);
    setGoals('');
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const scheduledSessions = sessions.filter(s => s.status === 'Scheduled');
  const completedSessions = sessions.filter(s => s.status === 'Completed');

  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  const parseTimeStr = (dateStr, timeSlotStr) => {
    try {
      const [startStr, endStr] = timeSlotStr.split(" - ");
      
      const parseSingleTime = (timeStr) => {
        const [hm, ampm] = timeStr.split(" ");
        let [hours, minutes] = hm.split(":").map(Number);
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day, hours, minutes, 0, 0);
      };

      return {
        start: parseSingleTime(startStr),
        end: parseSingleTime(endStr)
      };
    } catch (err) {
      return null;
    }
  };

  const isSessionActive = (sess) => {
    if (!sess.meetLink) return false;
    const range = parseTimeStr(sess.date, sess.timeSlot);
    if (!range) return false;
    // Allow joining 5 minutes early
    const startTimeWithBuffer = new Date(range.start.getTime() - 5 * 60 * 1000);
    return currentTime >= startTimeWithBuffer && currentTime <= range.end;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Mentorship & Audit Sessions
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Review your resume, verify your public developer profile, or request interactive audits for completed practice repositories with senior developers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <FontAwesomeIcon icon={faPlusCircle} className="w-5 h-5 text-brand-primary" />
              Schedule 1-on-1 Guidance Slot
            </h3>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-6">
              {/* Session Topic */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">Guidance Topic</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Resume Building', label: 'Resume Review', desc: 'Structure & formatting review' },
                    { id: 'Profile Management', label: 'Profile Verification', desc: 'Audit for HR-verification' },
                    { id: 'Project Review', label: 'Code Review Audit', desc: 'Practice repo grading review' }
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => setTopic(item.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        topic === item.id
                          ? 'border-brand-primary bg-brand-primary/10 text-white'
                          : 'border-white/5 bg-black/40 text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <h4 className="text-xs font-bold">{item.label}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 leading-snug">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">Select Date</label>
                {dates.length === 0 ? (
                  <div className="p-5 bg-zinc-950/40 border border-white/5 rounded-xl text-center text-xs text-gray-500">
                    No available mentoring dates at the moment. Please contact the administrator.
                  </div>
                ) : (
                  <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                    {dates.map(dateItem => (
                      <div
                        key={dateItem.value}
                        onClick={() => setSelectedDate(dateItem.value)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border min-w-16 cursor-pointer select-none transition-all ${
                          selectedDate === dateItem.value
                            ? 'border-brand-primary bg-brand-primary/10 text-white shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                            : 'border-white/5 bg-black/40 text-gray-400 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-medium uppercase">{dateItem.day}</span>
                        <span className="text-lg font-extrabold my-0.5">{dateItem.date}</span>
                        <span className="text-[9px] text-gray-500">{dateItem.month}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Time Slots */}
              {dates.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 block">Select Time Slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {slotsForSelectedDate.map(slotItem => (
                      <div
                        key={slotItem.value}
                        onClick={() => setSelectedSlot(slotItem.value)}
                        className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                          selectedSlot === slotItem.value
                            ? 'border-brand-primary bg-brand-primary/10 text-white font-bold'
                            : 'border-white/5 bg-black/40 text-gray-400 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        <span className="text-[10px] font-semibold block">{slotItem.value}</span>
                        <span className="text-[8px] text-gray-500 block uppercase mt-0.5">{slotItem.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Session Description & Goals</label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Mention repository links or specific questions you want reviewed..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:border-brand-primary outline-none min-h-20"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={dates.length === 0 || !selectedDate || !selectedSlot}
                className="w-full glow-btn bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold rounded-lg py-2.5 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-40"
              >
                <span>Confirm Live Appointment</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-black" />
              </button>
            </form>
          </div>
        </div>

        {/* Sessions Log Lists (Right Column) */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Upcoming Schedule ({scheduledSessions.length})
            </h3>
            
            {scheduledSessions.length === 0 ? (
              <p className="text-[10px] text-gray-500 text-center py-4">No sessions scheduled.</p>
            ) : (
              <div className="space-y-3.5">
                {scheduledSessions.map(sess => (
                  <div key={sess.id} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2.5 animate-fadeIn">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {sess.type}
                      </span>
                      <span className="text-[9px] text-gray-500 font-semibold flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5 text-gray-500" /> Scheduled
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{sess.title}</h4>
                      <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1 font-semibold">
                        <FontAwesomeIcon icon={faUser} className="text-brand-primary" /> {sess.tutor}
                      </p>
                    </div>

                    <div className="text-[9px] text-gray-500 font-semibold space-y-1 bg-black/50 p-2 rounded border border-white/5">
                      <p>Date: <strong className="text-gray-300">{sess.date}</strong></p>
                      <p>Slot: <strong className="text-gray-300">{sess.timeSlot}</strong></p>
                    </div>

                    {isSessionActive(sess) ? (
                      <a
                        href={sess.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="glow-btn w-full bg-[#1b1b20] hover:bg-white/5 text-gray-200 hover:text-white py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all border border-white/5 text-center flex items-center justify-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faVideo} className="text-brand-primary animate-pulse" />
                        <span>Join Google Meet</span>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-[#1b1b20]/40 text-gray-500 py-1.5 rounded-lg text-[10px] font-bold tracking-wide border border-white/5 text-center flex items-center justify-center gap-1.5 cursor-not-allowed opacity-50"
                        title={sess.meetLink ? "This button will be active during the scheduled session time (up to 5 mins early)." : "No meeting link has been provided yet."}
                      >
                        <FontAwesomeIcon icon={faVideo} className="text-gray-600" />
                        <span>Join Google Meet (Locked)</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Audits Feed */}
          <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Past Review Summaries
            </h3>

            {completedSessions.length === 0 ? (
              <p className="text-[10px] text-gray-500 text-center py-4">No completed reviews.</p>
            ) : (
              <div className="space-y-3.5">
                {completedSessions.map(sess => (
                  <div key={sess.id} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {sess.type}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400" /> Completed
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-300 leading-tight">{sess.title}</h4>
                      <p className="text-[9px] text-gray-500 mt-0.5">Reviewed by: {sess.tutor}</p>
                    </div>

                    {sess.notes && (
                      <div className="bg-[#0b0b0d] p-2.5 rounded-lg border border-white/5 text-[9px] text-gray-400 space-y-1">
                        <span className="font-bold text-gray-500 flex items-center gap-1">
                          <FontAwesomeIcon icon={faComment} className="text-brand-primary" /> Expert Notes:
                        </span>
                        <p className="italic">"{sess.notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
