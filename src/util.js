const typeOf = type => val => typeof val === type;

export const is = {
    gen (genFunc) {
        // fix 'regeneratorRuntime' polyfill
        if (typeof window !== 'undefined' && window.regeneratorRuntime) {
            return window.regeneratorRuntime.isGeneratorFunction(genFunc);
        }

        return genFunc.constructor.name === 'GeneratorFunction';
    },
    defined: v => v != null, // void 0 or null
    undef: typeOf('undefined'),
    obj: v => v && typeof v === 'object',
    arr: Array.isArray,
    func: typeOf('function'),
    str: typeOf('string'),
    num: v => !isNaN(v) && typeof v === 'number',
    element: v => is.obj(v) && v.nodeType,
    promise: v => v && is.func(v.then)
};