import { clsx } from "clsx";
import mgip from "../../pictures/washington_white.webp";
export function Gradient({ className, ...props }) {
  return (
    <div>
      <div
        {...props}
        className={clsx(className, "bg-cover bg-center")}
        style={{ backgroundImage: `url(${mgip})` }}
      />
      <div className="absolute inset-0 bg-black opacity-20 mt-2 ml-2 mr-2 rounded-4xl	"></div>
    </div>
  );
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          "absolute -right-60 -top-44 h-60 w-[36rem] transform-gpu md:right-0",
          "bg-[linear-gradient(115deg,var(--tw-gradient-stops))] from-[#79dcf2] from-[28%] via-[#4085f6] via-[70%] to-[#1E3A8A]",
          "rotate-[-10deg] rounded-full blur-3xl"
        )}
      />
    </div>
  );
}
