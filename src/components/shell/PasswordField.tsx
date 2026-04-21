"use client";

import { forwardRef, useState } from "react";
import { Icon } from "@/shared/ui/Icon";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
};

export const PasswordField = forwardRef<HTMLInputElement, Props>(
  function PasswordField({ label, error, ...rest }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold text-on-surface-variant">
          {label}
        </span>
        <div className="relative">
          <input
            {...rest}
            ref={ref}
            type={visible ? "text" : "password"}
            className="w-full rounded-xl bg-surface-container-highest px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
          >
            <Icon
              name={visible ? "visibility_off" : "visibility"}
              className="text-lg"
            />
          </button>
        </div>
        {error && (
          <span className="mt-1 block text-[11px] font-semibold text-error">
            {error}
          </span>
        )}
      </label>
    );
  }
);
