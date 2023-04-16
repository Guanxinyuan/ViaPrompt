export const taskConfig = {
    'optimize': {
        description: 'Creating satisfying prompts costs time and resources of testings. Now, type in your prompt, wait for a quick optimization, and bang you get the perfect prompt in a flash.',
        textColor: `text-yellow-500 active:text-yellow-600
        dark:text-yellow-500 dark:active:text-yellow-400`,
        backgroundColor: `bg-yellow-500`,
        borderColor: `border-yellow-500 active:border-yellow-600
        dark:border-yellow-500 dark:active:border-yellow-400`,
        buttonColor: `bg-yellow-500 active:bg-yellow-600`,
        sections: { inputSection: 'original', outputSection: 'optimized' },
    },
    'analyze': {
        description: 'Best prompts have patterns. This feature breaks down great prompts into essential components, so you can rebuild from success and create your winning ones.',
        textColor: `text-purple-500 active:text-purple-600
        dark:text-purple-500 dark:active:text-purple-400`,
        backgroundColor: `bg-purple-500`,
        borderColor: `border-purple-500 active:border-purple-600
        dark:border-purple-500 dark:active:border-purple-400`,
        buttonColor: `bg-purple-500 active:bg-purple-600`,
        sections: { inputSection: 'original', outputSection: 'analysis' },
    },
    'memo': {
        description: 'Random inspirations matter. You can simply take a note of your favorite prompts effortlessly with the memo feature, allowing you to build a valuable collection of ideas and inspiration for future use.',
        textColor: `text-zinc-500 active:text-zinc-600
        dark:text-zinc-500 dark:active:text-zinc-400`,
        backgroundColor: `bg-zinc-500`,
        borderColor: `border-zinc-500 active:border-zinc-600
        dark:border-zinc-500 dark:active:border-zinc-400`,
        buttonColor: `bg-zinc-500 active:bg-zinc-600`,
        sections: { inputSection: '', outputSection: 'memo' },
    },
}

export const textColor = {
    'optimize':
        `text-yellow-500 active:text-yellow-600
    dark:text-yellow-500 dark:active:text-yellow-400`,
    'analyze':
        `text-purple-500 active:text-purple-600
    dark:text-purple-500 dark:active:text-purple-400`,
    'memo':
        `text-zinc-500 active:text-zinc-600
    dark:text-zinc-500 dark:active:text-zinc-400`,
}

export const borderColor = {
    'optimize':
        `border-yellow-500 active:border-yellow-600
    dark:border-yellow-500 dark:active:border-yellow-400`,
    'analyze':
        `border-purple-500 active:border-purple-600
    dark:border-purple-500 dark:active:border-purple-400`,
    'memo':
        `border-zinc-500 active:border-zinc-600
    dark:border-zinc-500 dark:active:border-zinc-400`,
}

export const taskBackgroundColor = {
    'optimize': 'bg-yellow-500 dark',
    'analyze': 'bg-purple-500 dark',
    'memo': 'bg-zinc-500 dark',
}