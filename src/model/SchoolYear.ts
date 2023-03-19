export function getCurrentSchoolYear(): string {
    const date = new Date()
    // 10. month to account for
    if (date.getMonth() >= 9) {
        // school year started this year
        return date.getFullYear().toString() + "/" + (date.getFullYear() + 1).toString()
    } else {
        return (date.getFullYear() - 1).toString() + "/" + date.getFullYear().toString()
    }
}
