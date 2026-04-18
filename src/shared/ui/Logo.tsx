import Link from "next/link";
import clsx from "clsx";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "font-headline text-2xl font-black tracking-tighter text-primary",
        className
      )}
    >
      dokkaebi
    </Link>
  );
}
