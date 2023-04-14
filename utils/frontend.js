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

export function formatISOString(isoString, formatOption) {
    const date = new Date(isoString);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const monthAbbrNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const dayAbbrNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = hours24 < 12 ? "AM" : "PM";
    const dayOfWeek = date.getDay();

    switch (formatOption) {
        case 1: // Apr 12, 2023 08:50 PM
            return `${monthAbbrNames[monthIndex]} ${day}, ${year} ${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        case 2: // April 12, 2023 08:50 PM
            return `${monthNames[monthIndex]} ${day}, ${year} ${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        case 3: // Wed, Apr 12, 2023 20:50
            return `${dayAbbrNames[dayOfWeek]} ${monthAbbrNames[monthIndex]} ${day}, ${year} ${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        case 4: // Wednesday, April 12, 2023 20:50
            return `${dayNames[dayOfWeek]} ${monthNames[monthIndex]} ${day}, ${year} ${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        case 5: // 3 days ago
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) {
                return 'Just now';
            }

            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) {
                return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
            }

            const diffInHours = Math.floor(diffInSeconds / 3600);
            if (diffInHours < 24) {
                return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
            }

            const diffInDays = Math.floor(diffInSeconds / 86400);
            if (diffInDays < 7) {
                return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
            }

            return `${monthAbbrNames[monthIndex]} ${day}, ${year} ${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        default:
            return `${monthAbbrNames[monthIndex]} ${day}, ${year} ${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}






export default discordImageLoader;