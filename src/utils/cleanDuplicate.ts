
export default function cleanDuplicate<T>(arr: T[]): T[] {
    // @ts-ignore
    return [...new Map<string, T>(arr.map((value) => [value, value])).values()]
}