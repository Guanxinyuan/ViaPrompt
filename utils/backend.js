import AWS from 'aws-sdk';

// This function fetches the raw data from json_file stored in the S3 bucket
export const fetchFileFromS3 = async (filepath) => {
    const s3 = new AWS.S3({
        accessKeyId: 'AKIAWEWB5TVQ72XF4QQG',
        secretAccessKey: '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',
        region: 'us-east-2',
    });

    const params = { Bucket: 'bc-prompt-bucket', Key: filepath };
    const data = await s3.getObject(params).promise();
    const json_data = JSON.parse(data.Body.toString('utf-8'));
    return json_data
}


// This function integrates the fetchFileFromS3 & processes the raw data from json_file stored in the S3 bucket; 
// Possibly will not use.
export const processMidjourneyData = async (filepath) => {

    const json_data = await fetchFileFromS3(filepath)
    const dataProcessed = json_data.filter(d => d.bot && d.mention && d.attachment && d.content.length > 0).map((d) => {
        const delimiter = ' - '
        const delimiter_index = d.content.lastIndexOf(delimiter);
        const prompt = d.content.slice(0, delimiter_index).replace(/^\*+|\*+$/g, '');
        const status = d.content.slice(delimiter_index + delimiter.length);

        return {
            content_id: d.content_id,
            prompt: prompt,
            type: status[0] == 'V' ? "variation" : status[0] == 'U' ? "upscale" : "normal",
            id_mentioned: d.mention,
            timestamp: d.timestamp,
            updated_at: new Date().toISOString(),
            gc_size: d.attachment.size,
            gc_width: d.attachment.width,
            gc_height: d.attachment.height,
            gc_type: d.attachment.content_type,
            gc_url: `https://media.discordapp.net/attachments/${d.channel_id}/${d.attachment.id}/${d.attachment.filename}`,
            model: 'Midjourney V4',
            channel_id: d.channel_id,
        }
    })
    return dataProcessed
}