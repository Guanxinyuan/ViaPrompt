export const taskConfig = {
    'optimize': {
        description: "Allows you to generate better results with various mode. Best to use when you don't want to cost hours (& money) on crafting prompts.",
        textColor: `text-yellow-500 active:text-yellow-600
        dark:text-yellow-500 dark:active:text-yellow-400`,
        backgroundColor: `bg-yellow-500`,
        borderColor: `border-yellow-500
        dark:border-t-yellow-500`,
        buttonColor: `bg-yellow-500 active:bg-yellow-600`,
        sections: { inputSection: 'original', outputSection: 'optimized' },
    },
    'memo': {
        description: 'Just take a memo of your favorite prompts. Best to use when you want to save your favorite prompts for later use or inspiration.',
        textColor: `text-zinc-500 active:text-zinc-600
        dark:text-zinc-500 dark:active:text-zinc-400`,
        backgroundColor: `bg-zinc-500`,
        borderColor: `border-zinc-500
        dark:border-t-zinc-500`,
        buttonColor: `bg-zinc-500 active:bg-zinc-600`,
        sections: { inputSection: '', outputSection: 'memo' },
    },
}