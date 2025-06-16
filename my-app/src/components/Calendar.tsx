import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<{day: number, dateKey: string, agendas: any[]} | null>(null);
    const [showModal, setShowModal] = useState(false);

  // Sample agenda data - you can replace this with your actual data
    const agendaData: {[key: string]: any[]} = {
    '2025-06-05': [
        { id: 1, title: 'Progress with Street Enhancement Lighting Program', time: '10:00 AM', color: 'bg-smblue-400' },
        { id: 2, title: 'Review project milestones', time: '2:00 PM', color: 'bg-green-500' }
    ],
    '2025-06-12': [
        { id: 3, title: 'Community meeting', time: '9:00 AM', color: 'bg-purple-500' }
    ],
    '2025-06-18': [
        { id: 4, title: 'Budget review', time: '3:00 PM', color: 'bg-yellow-500' }
    ],
    '2025-06-23': [
        { id: 5, title: 'Contractor evaluation', time: '11:00 AM', color: 'bg-red-500' }
    ],
    };

    const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleDateClick = (day: number): void => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate({ day, dateKey, agendas: agendaData[dateKey] || [] });
    setShowModal(true);
    };

    const handlePrevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const currentMonth = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Get today's date for comparison
    const today = new Date();
    const isToday = (day: number): boolean => {
    return day === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear();
    };

    return (
    <>
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-10px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeInScale {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes modalSlideIn {
                from { transform: scale(0.95) translateY(-20px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes slideDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideRight {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes pulseSlow {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes pulseDot {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
            }
            @keyframes subtlePulse {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.8; }
            }
            
            .animate-fade-in { animation: fadeIn 0.3s ease-out; }
            .animate-slide-in { animation: slideIn 0.4s ease-out; }
            .animate-fade-in-scale { animation: fadeInScale 0.4s ease-out; }
            .animate-modal-slide-in { animation: modalSlideIn 0.3s ease-out; }
            .animate-slide-down { animation: slideDown 0.2s ease-out; }
            .animate-slide-right { animation: slideRight 0.3s ease-out; }
            .animate-slide-up { animation: slideUp 0.3s ease-out; }
            .animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
            .animate-pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
            .animate-subtle-pulse { animation: subtlePulse 2s ease-in-out infinite; }
        `}</style>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-smblue-400 pl-4">
            Project Calendar
            </h3>
        </div>
        
        <div className="flex justify-between items-center mb-4">
            <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-all duration-150 transform hover:scale-102 active:scale-98"
            >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h4 className="font-medium text-gray-900 animate-fade-in">{currentMonth}</h4>
            <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-all duration-150 transform hover:scale-102 active:scale-98"
            >
            <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div 
                key={day} 
                className="text-center text-xs font-medium text-gray-500 py-2 animate-slide-in"
                style={{animationDelay: `${index * 30}ms`}}
            >
                {day}
            </div>
            ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="p-2 h-12"></div>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
            const hasAgenda = agendaData[dateKey] && agendaData[dateKey].length > 0;
            
            return (
                <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 h-12 text-sm text-center rounded transition-all duration-200 transform hover:scale-102 active:scale-98 hover:shadow-sm animate-fade-in-scale relative ${
                    isToday(day) 
                        ? 'bg-smblue-400 text-white hover:bg-smblue-500 shadow-md animate-pulse-slow' 
                        : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{animationDelay: `${day * 15}ms`}}
                >
                <span className="block relative z-10">{day}</span>
                {hasAgenda && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {agendaData[dateKey].slice(0, 3).map((agenda, idx) => (
                        <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${agenda.color} animate-subtle-pulse`}
                        style={{animationDelay: `${idx * 300}ms`}}
                        />
                    ))}
                    </div>
                )}
                </button>
            );
            })}
        </div>
    </div>

      {/* Modal for Agenda with Professional Animations - FIXED */}
      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" style={{ minHeight: '100vh', height: '100%' }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden animate-modal-slide-in">
            <div className="bg-gradient-to-r from-smblue-400 to-smblue-300 text-white p-4 flex justify-between items-center animate-slide-down">
              <h3 className="text-lg font-semibold animate-slide-right">
                {selectedDate && `${monthNames[currentDate.getMonth()]} ${selectedDate.day}, ${currentDate.getFullYear()}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-2xl transition-all duration-150 transform hover:scale-102 active:scale-98"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              {selectedDate && selectedDate.agendas.length > 0 ? (
                <div className="space-y-3">
                  {selectedDate.agendas.map((agenda, index) => (
                    <div
                      key={agenda.id}
                      className="border-l-4 pl-4 py-3 transform hover:scale-[1.005] transition-all duration-150 hover:shadow-sm rounded-r animate-slide-up bg-gray-50/30"
                      style={{ 
                        borderColor: agenda.color.includes('blue') ? '#93c5fd' :
                                  agenda.color.includes('green') ? '#6ee7b7' :
                                  agenda.color.includes('purple') ? '#c4b5fd' :
                                  agenda.color.includes('yellow') ? '#fde68a' :
                                  agenda.color.includes('red') ? '#fca5a5' : '#93c5fd',
                        animationDelay: `${index * 80}ms`
                      }}
                    >
                      <h4 className="font-medium text-gray-900 animate-fade-in">{agenda.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 animate-fade-in" style={{animationDelay: `${index * 80 + 40}ms`}}>{agenda.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No agenda items for this day</p>
                  <p className="text-gray-400 text-xs mt-1">Click dates with indicators to view events</p>
                </div>
              )}
            </div>
            
            <div className="border-t p-4 bg-gray-50/50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-smblue-400 text-white py-3 px-4 rounded-2xl hover:bg-smblue-500 transition-all duration-150 transform hover:scale-[1.005] active:scale-[0.995] shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;