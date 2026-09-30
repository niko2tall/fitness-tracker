export type BodyWeightDisplayUnit =
    | 'Kilograms'
    | 'Pounds';

const poundsPerKilogram =
    2.2046226218;

export function convertKilogramsToDisplayWeight(
    weightKg: number,
    unit: BodyWeightDisplayUnit
): number {
    return unit === 'Pounds'
        ? weightKg *
        poundsPerKilogram
        : weightKg;
}

export function convertDisplayWeightToKilograms(
    weight: number,
    unit: BodyWeightDisplayUnit
): number {
    const kilograms =
        unit === 'Pounds'
            ? weight /
            poundsPerKilogram
            : weight;

    return Number(
        kilograms.toFixed(4)
    );
}

export function formatBodyWeight(
    weightKg: number,
    unit: BodyWeightDisplayUnit
): string {
    const value =
        convertKilogramsToDisplayWeight(
            weightKg,
            unit
        );

    return (
        `${formatNumber(value)} ` +
        getBodyWeightUnitAbbreviation(
            unit
        )
    );
}

export function formatBodyWeightChange(
    changeKg: number,
    unit: BodyWeightDisplayUnit
): string {
    const value =
        convertKilogramsToDisplayWeight(
            changeKg,
            unit
        );

    const normalizedValue =
        Math.abs(value) <
            0.0001
            ? 0
            : value;

    const prefix =
        normalizedValue > 0
            ? '+'
            : '';

    return (
        `${prefix}` +
        `${formatNumber(
            normalizedValue
        )} ` +
        getBodyWeightUnitAbbreviation(
            unit
        )
    );
}

export function getBodyWeightUnitAbbreviation(
    unit: BodyWeightDisplayUnit
): string {
    return unit === 'Pounds'
        ? 'lb'
        : 'kg';
}

export function formatBodyWeightInputValue(
    weightKg: number,
    unit: BodyWeightDisplayUnit
): string {
    const value =
        convertKilogramsToDisplayWeight(
            weightKg,
            unit
        );

    return String(
        Number(
            value.toFixed(2)
        )
    );
}

export function toLocalDateTimeInputValue(
    value: string | Date
): string {
    const date =
        value instanceof Date
            ? value
            : new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return '';
    }

    const year =
        date.getFullYear();

    const month =
        padNumber(
            date.getMonth() + 1
        );

    const day =
        padNumber(
            date.getDate()
        );

    const hours =
        padNumber(
            date.getHours()
        );

    const minutes =
        padNumber(
            date.getMinutes()
        );

    return (
        `${year}-${month}-${day}` +
        `T${hours}:${minutes}`
    );
}

export function localDateTimeInputToUtc(
    value: string
): string | null {
    if (
        value.trim().length === 0
    ) {
        return null;
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    return date.toISOString();
}

function formatNumber(
    value: number
): string {
    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 2,
        }
    ).format(value);
}

function padNumber(
    value: number
): string {
    return value
        .toString()
        .padStart(
            2,
            '0'
        );
}