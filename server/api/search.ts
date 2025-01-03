import { defineEventHandler } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const value = query.value as string;

    if (!value) {
        return createError({ statusCode: 400, message: 'Value parameter is required' });
    }

    let alrData = {};
    let aurData = {};

    try {
        const alrResponse = await axios.get(`https://archlinux.org/packages/search/json/?q=${value}`);
        alrData = alrResponse.data;
    } catch (error) {
        console.log('Error fetching ALR data', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }

    try {
        const aurResponse = await axios.get(`https://aur.archlinux.org/rpc/v5/search/${value}`);
        aurData = aurResponse.data;
    } catch (error) {
        console.log('Error fetching AUR data', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }

    return normalizeResults(alrData, aurData);
});

function convertEpochToISO8601(epoch: number | null): string | null {
    if (epoch) {
        return new Date(epoch * 1000).toISOString();
    }
    return null;
}

function normalizeResults(alrData: any, aurData: any) {
    let allResults = [];

    for (const result of alrData.results || []) {
        allResults.push({
            name: result.pkgname,
            version: result.pkgver,
            source: "ALR",
            description: result.description,
            last_updated_date: result.last_update,
            flagged_date: result.flagged_date
        });
    }

    for (const result of aurData.results || []) {
        allResults.push({
            name: result.Name,
            version: result.Version,
            source: "AUR",
            description: result.Description,
            last_updated_date: convertEpochToISO8601(result.LastModified),
            flagged_date: convertEpochToISO8601(result.OutOfDate)
        });
    }

    return allResults;
}