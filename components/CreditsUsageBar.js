// components/CreditUsageBar.js

function CreditUsageBar({ creditsUsed, totalCredits }) {
    console.log(creditsUsed, totalCredits);
    const percentage = (creditsUsed / totalCredits) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
            </div>
            <div className="bg-zinc-700 rounded-md h-4 w-full">
                <div
                    className={`bg-green-500 h-4 rounded-md`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-zinc-500">{`${creditsUsed} Used`}</span>
                <span className="text-xs text-zinc-500">{`${totalCredits} Total`}</span>
            </div>
        </div>
    );
}

export default CreditUsageBar;
