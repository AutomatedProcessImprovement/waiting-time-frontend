export function dhmToString([years, days, hours, minutes]: [number, number, number, number]): string {
    let str = "";
    if (years > 0) {
        str += `${years}y `;
    }
    if (days > 0) {
        str += `${days}d `;
    }
    if (hours > 0) {
        str += `${hours}h `;
    }
    if (minutes > 0) {
        str += `${minutes}m`;
    }
    return str.trim();
}
