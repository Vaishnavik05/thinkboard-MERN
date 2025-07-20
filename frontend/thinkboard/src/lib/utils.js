export function formatDate(date) {
    let dateObj;
    if (date instanceof Date) {
        dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
    } else {
        return 'Invalid Date';
    }
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }
    return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}