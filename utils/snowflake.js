// utils/snowflake.js

let lastTimestamp = 0;
let sequence = 0;

const EPOCH = 1609459200000; // January 1, 2021 (in milliseconds)

export function generateSnowflake() {
    let now = Date.now();

    if (now < lastTimestamp) {
        throw new Error('Invalid system clock');
    }

    if (now === lastTimestamp) {
        sequence = (sequence + 1) % 4096;
        if (sequence === 0) {
            // We've generated too many IDs in the same millisecond, so wait until the next one
            now = waitUntilNextMillis(lastTimestamp);
        }
    } else {
        sequence = 0;
    }

    lastTimestamp = now;

    const timestamp = now - EPOCH;
    const id = (timestamp << 22) | (sequence << 10) | Math.floor(Math.random() * 1024);

    return id.toString();
}

function waitUntilNextMillis(lastTimestamp) {
    let now = Date.now();
    while (now <= lastTimestamp) {
        now = Date.now();
    }
    return now;
}
