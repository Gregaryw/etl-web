export function dateTime2str(dateTime, format) {
    var z = {
        y: dateTime.getFullYear(),
        M: dateTime.getMonth() + 1,
        d: dateTime.getDate(),
        h: dateTime.getHours(),
        m: dateTime.getMinutes(),
        s: dateTime.getSeconds()
    };
    return format.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval("z." + v.slice(-1))).slice(
            -(v.length > 2 ? v.length : 2)
        );
    });
}