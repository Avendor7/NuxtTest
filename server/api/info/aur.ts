import { defineEventHandler } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const value = query.value as string;

    if (!value) {
        return createError({ statusCode: 400, message: 'Value parameter is required' });
    }

    try {
        const response = await axios.get(`https://aur.archlinux.org/rpc/v5/info?arg=${value}`);
        const aurData = response.data;

        if (aurData.results && aurData.results[0]) {
            aurData.results[0].LastModified = convertEpochToISO8601(aurData.results[0].LastModified);
            aurData.results[0].OutOfDate = convertEpochToISO8601(aurData.results[0].OutOfDate);
        }

        return aurData;
    } catch (error) {
        console.log('Error', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});

function convertEpochToISO8601(epoch: number | null): string | null {
    if (epoch) {
        return new Date(epoch * 1000).toISOString();
    }
    return null;
}