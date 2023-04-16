// components/CreditUsageBar.js

function CreditUsageBar({ creditsUsed, totalCredits }) {
    console.log(creditsUsed, totalCredits);
    const percentage = (creditsUsed / totalCredits) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center flex gap-4">
                <div className="bg-zinc-700 rounded-md h-4 w-full ">
                    <div
                        className={`bg-green-500 h-4 rounded-md`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <span className="text-xs text-zinc-500 min-w-max">{`${creditsUsed}/${totalCredits} Used`}</span>
            </div>
        </div>
    );
}

export default CreditUsageBar;
