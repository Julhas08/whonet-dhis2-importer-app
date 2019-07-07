export const request = (
    endpoint,
    { fields, filters, order, options, paging = false }
) => {
    //let url = `${endpoint}?paging=${paging}`
    let url = `${endpoint}`

    if (fields) url += `&fields=${fields}`
    if (filters) url += `&filter=${filters}`
    if (order) url += `&order=${order}`
    if (options) url += `&${options.join('&')}`
    //console.log("URL: ", url);
    return url
}