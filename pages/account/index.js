// import Authenticate from "@/components/Authenticate";
import dynamic from "next/dynamic";
const Authenticate = dynamic(() => import("@/components/Authenticate"));

export default function AccountPage() {
    return (
        // <div className="absolute border border-black container mx-auto justify-center h-screen items-center flex">
        <div>
            {/* <p className="text-2xl font-bold">Account</p> */}
            <Authenticate />
        </div>
    )
}