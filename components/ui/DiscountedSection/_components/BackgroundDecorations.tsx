export const BackgroundDecorations = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl" />
    </div>
  )
}
