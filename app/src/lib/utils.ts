
export const formatTripDates = (dateStr: string | undefined) => {
    if (!dateStr || !dateStr.includes(" to ")) return { range: dateStr || "Planning Phase", year: "" };

    try {
        const [startStr, endStr] = dateStr.split(" to ");
        const start = new Date(startStr);
        const end = new Date(endStr);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formatPart = (d: Date) => `${monthNames[d.getMonth()]} ${d.getDate()}`;

        return {
            range: `${formatPart(start)} to ${formatPart(end)}`,
            year: start.getFullYear().toString()
        };
    } catch (e) {
        return { range: dateStr, year: "" };
    }
};

export const formatFullTripDate = (dateStr: string | undefined) => {
    const { range, year } = formatTripDates(dateStr);
    if (!year) return range;
    return `${range} | ${year}`;
};
