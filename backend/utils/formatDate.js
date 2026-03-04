export function formatDate(date) {
    return new Intl.DateTimeFormat("uk-UA", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}
export function formatDates(item) {
    return {
        ...item,
        formatedCreateDate: formatDate(item.createdAt),
        formatedUpdateDate: formatDate(item.updatedAt)
    };
}
