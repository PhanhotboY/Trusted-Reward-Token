import { CSSProperties, ReactNode } from "react";

export default function PrimaryButton({
  form,
  type,
  children,
  className,
  onClick,
  style,
}: {
  form?: string;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type={type}
      form={form}
      className={`rounded px-3 py-2 text-white ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
