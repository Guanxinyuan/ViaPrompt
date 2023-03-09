export const simplifyRatio = (numerator, denominator) => {
    // Calculate the greatest common factor (GCF) using the Euclidean algorithm
    let a = numerator;
    let b = denominator;
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    const gcf = a;

    // Divide both numerator and denominator by the GCF to simplify the ratio
    const simplifiedNumerator = numerator / gcf;
    const simplifiedDenominator = denominator / gcf;

    // Return the simplified ratio as a string in the format "numerator:denominator"
    return [simplifiedNumerator, simplifiedDenominator];
}

export function getClosestRatio(width, height) {
    const ratios = [
        { name: '1:1', value: 1 / 1, aspect_w: 1, aspect_h: 1 },
        { name: '4:3', value: 4 / 3, aspect_w: 4, aspect_h: 3 },
        { name: '3:4', value: 3 / 4, aspect_w: 3, aspect_h: 4 },
        { name: '3:2', value: 3 / 2, aspect_w: 3, aspect_h: 2 },
        { name: '2:3', value: 2 / 3, aspect_w: 2, aspect_h: 3 },
        { name: '16:9', value: 16 / 9, aspect_w: 16, aspect_h: 9 },
        { name: '9:16', value: 9 / 16, aspect_w: 9, aspect_h: 16 },
        { name: '2:1', value: 2 / 1, aspect_w: 2, aspect_h: 1 },
        { name: '1:2', value: 1 / 2, aspect_w: 1, aspect_h: 2 },
        { name: '3:1', value: 3 / 1, aspect_w: 3, aspect_h: 1 },
        { name: '1:3', value: 1 / 3, aspect_w: 1, aspect_h: 3 },
        { name: '4:1', value: 4 / 1, aspect_w: 4, aspect_h: 1 },
        { name: '1:4', value: 1 / 4, aspect_w: 1, aspect_h: 4 },

    ];

    const imageRatio = width / height;
    let closestRatio = ratios[0];

    for (let i = 1; i < ratios.length; i++) {
        const ratio = ratios[i];
        const diff = Math.abs(ratio.value - imageRatio);
        if (diff == 0) {
            return [ratio.aspect_w, ratio.aspect_h]
        }

        if (diff < Math.abs(closestRatio.value - imageRatio)) {
            closestRatio = ratio;
        }
    }

    return [closestRatio.aspect_w, closestRatio.aspect_h]
}


export const widthVariants = {
    1: 'aspect-w-1',
    2: 'aspect-w-2',
    3: 'aspect-w-3',
    4: 'aspect-w-4',
    5: 'aspect-w-5',
    6: 'aspect-w-6',
    7: 'aspect-w-7',
    8: 'aspect-w-8',
    9: 'aspect-w-9',
    10: 'aspect-w-10',
    11: 'aspect-w-11',
    12: 'aspect-w-12',
    13: 'aspect-w-13',
    14: 'aspect-w-14',
    15: 'aspect-w-15',
    16: 'aspect-w-16'
}


export const heightVariants = {
    1: 'aspect-h-1',
    2: 'aspect-h-2',
    3: 'aspect-h-3',
    4: 'aspect-h-4',
    5: 'aspect-h-5',
    6: 'aspect-h-6',
    7: 'aspect-h-7',
    8: 'aspect-h-8',
    9: 'aspect-h-9',
    10: 'aspect-h-10',
    11: 'aspect-h-11',
    12: 'aspect-h-12',
    13: 'aspect-h-13',
    14: 'aspect-h-14',
    15: 'aspect-h-15',
    16: 'aspect-h-16'
}