// ============================================================
// TOGGLE SWITCH - Composant ON/OFF style OVH (30x15px)
// ============================================================

import { useState } from "react";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, disabled = false }: Props) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (disabled || pending) return;
    setPending(true);
    try {
      await onChange(!checked);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? "on" : "off"} ${disabled || pending ? "disabled" : ""}`}
      onClick={handleClick}
      disabled={disabled || pending}
      aria-pressed={checked}
    >
      <span className="toggle-track">
        <span className="toggle-knob" />
      </span>
    </button>
  );
}

export default ToggleSwitch;
