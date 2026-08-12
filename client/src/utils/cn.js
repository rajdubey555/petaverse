/**
 * cn() — Classname utility
 * Joins class names, filtering out falsy values.
 * Supports strings, objects { 'class': condition }, and arrays.
 *
 * Usage:
 *   cn('btn', 'btn-primary')                          // "btn btn-primary"
 *   cn('btn', { 'btn-disabled': isDisabled })          // conditionally adds class
 *   cn('btn', ['px-4', 'py-2'])                        // flattens arrays
 *   cn('btn', false && 'hidden', undefined, null, '')  // filters falsy
 *
 * For Tailwind CSS, conflict-free merging can be added later with tailwind-merge.
 */

const cn = (...inputs) => {
    return inputs
        .flat(Infinity)
        .filter(Boolean)
        .reduce((acc, input) => {
            if (typeof input === 'string') {
                acc.push(input);
            } else if (typeof input === 'object' && input !== null) {
                Object.entries(input).forEach(([key, value]) => {
                    if (value) {
                        acc.push(key);
                    }
                });
            }
            return acc;
        }, [])
        .join(' ');
};

export { cn };
export default cn;