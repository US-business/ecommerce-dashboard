export const BottomWave = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,60 350,60 600,30 C850,0 1050,60 1200,30 L1200,120 L0,120 Z"
          className="fill-white"
        />
      </svg>
    </div>
  )
}
