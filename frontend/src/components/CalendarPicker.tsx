import React from "react";

interface CalendarPickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm text-gray-400 mb-1">Select date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
      />
    </div>
  );
};
