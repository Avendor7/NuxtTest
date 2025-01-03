import { defineEventHandler } from 'h3';
import axios from 'axios';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const value = query.value as string;

    if (!value) {
        return createError({ statusCode: 400, message: 'Value parameter is required' });
    }

    try {
        const response = await axios.get(`https://archlinux.org/packages/search/json/?q=${value}`);
        return response.data;
    } catch (error) {
        console.log('Error', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});