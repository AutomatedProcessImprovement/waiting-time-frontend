export function secondsToDhm(seconds: number): [number, number, number, number] {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600 * 24));
    let y = Math.floor(d / 365);
    d = d % 365;
    let h = Math.floor((seconds % (3600 * 24)) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    return [y, d, h, m];
}
