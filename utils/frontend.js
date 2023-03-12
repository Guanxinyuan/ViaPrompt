const discordImageLoader = ({ src, width, quality }) => {
    if (src.startsWith("https://cdn.discordapp.com/")) {
        const newSrc = src.replace("https://cdn.discordapp.com/", "https://d1fnc2wv9zomi3.cloudfront.net/")
        return `${newSrc}?w=${width}&q=${quality || 75}`
    } else {
        return `${src}?w=${width}&q=${quality || 75}`
    }

};

export default discordImageLoader;