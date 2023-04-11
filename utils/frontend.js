const discordImageLoader = ({ src, width, quality }) => {
    if (src.startsWith("https://cdn.discordapp.com/")) {
        const newSrc = src.replace("https://cdn.discordapp.com/", "https://d1fnc2wv9zomi3.cloudfront.net/")
        return `${newSrc}?w=${width}&q=${quality || 75}`
    } else {
        return `${src}?w=${width}&q=${quality || 75}`
    }

};

export const makeParameterString = (version, quality, stylize, stop, seed, chaos, sizes) => {
    const defaultVersion = 'Version 4 (Default)'
    const defaultQuality = 1
    const defaultStylize = 100
    const defaultStop = 100
    const defaultSeed = ''
    const defaultChaos = 0
    const defaultSizes = 'Default (1024 x 1024)'

    const [aspectWidth, aspectHeight] = sizes.split(":");
    let sizesString = ''
    if (sizes != defaultSizes) {
        if (!isNaN(parseInt(aspectWidth)) && parseInt(aspectWidth) > 0 &&
            !isNaN(parseInt(aspectHeight)) && parseInt(aspectHeight) > 0) {
            sizesString = `--ar ${aspectWidth}:${aspectHeight} `
        }
    } else {
        sizesString = ''
    }

    const versionString = version == defaultVersion ? '' : version == 'Niji' ? '--niji ' : `--v ${version.slice(-1)} `
    const qualityString = quality == defaultQuality ? '' : `--q ${quality} `
    const stylizeString = stylize == defaultStylize ? '' : `--s ${stylize} `
    const stopString = stop == defaultStop ? '' : `--stop ${stop} `
    const seedString = seed == defaultSeed ? '' : `--seed ${seed} `
    const chaosString = chaos == defaultChaos ? '' : `--c ${chaos} `
    const paramString = `${versionString}${qualityString}${stylizeString}${stopString}${seedString}${chaosString}${sizesString}`
    return paramString.trim()
}

export const convertISOToDate = (dateString) => {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    } catch (error) {
        return dateString;
    }
}

export default discordImageLoader;