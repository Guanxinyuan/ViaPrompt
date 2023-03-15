export default function ParamButton({ children }) {
    return (
        <button className="w-full bg-yellow-500 hover:bg-yellow-700 text-white text-base rounded-lg p-2">
            {children}
        </button>
    )
}