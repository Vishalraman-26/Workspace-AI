export function getHeader(headers, name) {

    const header = headers.find(
        h => h.name.toLowerCase() === name.toLowerCase()
    );

    return header ? header.value : "";

}