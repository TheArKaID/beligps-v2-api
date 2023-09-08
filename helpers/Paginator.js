export default {
    getPagination: (page, size) => {
        const limit = size ? +size : 10;
        const offset = !!Number(page) ? (page - 1) * limit : 0;
    
        return { limit, offset };
    },
    getPagingData: (data, page, limit) => {
        const { count: totalItems, rows: datas } = data;
        const currentPage = !!Number(page) ? +page : 1;
    
        const totalPages = Math.ceil(totalItems / limit);
    
        return { totalItems, datas, totalPages, currentPage };
    },
}