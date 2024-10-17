import "./style.css";
export const Loader = () => {
  return (
    <div className="prose flex h-full w-full max-w-none flex-col items-center justify-center">
      <svg className="spinner" viewBox="0 0 50 50">
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#f0129c" />
            <stop offset="100%" stopColor="#1a0025" />
          </linearGradient>
        </defs>
        <circle className="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
      <p className="m-0 font-bold text-white text-center">
        Aan het verwerken... Even geduld a.u.b
      </p>
    </div>
  );
};
