import clickhouse from '../config/clickhouse.js';

const controllers = {};

controllers.getTrackReplay = async (req, res, next) => {
    let { device_id, start_time, end_time } = req.query;

    if (!device_id) {
        res.status(400).json({ message: 'device_id is required' });
        return;
    }

    start_time = start_time ? new Date(start_time).toISOString() : new Date(new Date().setHours(0, 0, 1, 0)).toISOString();
    end_time = end_time ? new Date(end_time).toISOString() : new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

    const query = `
        SELECT
            latitude,
            longitude,
            fix_time,
            server_time
        FROM
            positions
        WHERE 
            device_id == '${device_id}'
            AND 
            latitude != 0
            AND
            (fix_time > '${start_time}' AND fix_time < '${end_time}')
        ORDER BY 
            fix_time
    `;

    try {
        const result = await (await clickhouse.query({query})).json();
        res.status(200).json(result.data);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

export default controllers;