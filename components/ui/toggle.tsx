"use client";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function Toggle({checked, onChange, disabled = false}: ToggleProps) {
    return (
        <label className={`relative inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-(--accent-color) peer-focus:ring-2 peer-focus:ring-(--accent-color)/30 transition-colors duration-200">
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
            </div>
        </label>
    );
}