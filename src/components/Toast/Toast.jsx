export default function Toast({ msg, icon }) {
  return (
    <div className="toast">
      <span className="toast-icon">{icon}</span>
      <span>{msg}</span>
    </div>
  )
}
