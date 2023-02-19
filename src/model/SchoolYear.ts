export function getCurrentSchoolYear(): string {
    const date = new Date()
    if (date.getMonth() >= 8) { // school year started this year
        return date.getFullYear().toString() + "/" + (date.getFullYear() + 1).toString()
    } else {
        return (date.getFullYear() - 1).toString() + "/" + date.getFullYear().toString()
    }
}
