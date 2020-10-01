const { joinWithCharLimit, joinWithoutEmpties } = require('../playlists/utils');

describe('join without empties', () => {
    let j = joinWithoutEmpties;

    let empty = [];
    let empties = ['', '', ''];
    let someColors = ['red', 'orange', '', 'green', '', '', 'purple'];
    let allColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

    it('joins without empties', () => {
        expect(j(empty)).toBe('');
        expect(j(empties)).toBe('');
        expect(j(someColors)).toBe("red, orange, green, purple");
        expect(j(allColors)).toBe("red, orange, yellow, green, blue, purple");
    });

    it('adds the right separator', () => {
        let separator = ' | ';

        expect(j(empty, separator)).toBe('');
        expect(j(empties, separator)).toBe('');
        expect(j(someColors, separator)).toBe("red | orange | green | purple");
        expect(j(allColors, separator)).toBe("red | orange | yellow | green | blue | purple");
    })
})

describe("join with a character limit", () => {
    let colors = ["turquoise", "magenta", "mauve"];
    let generalStatement = "I think everything is better with some color."
    let opener = "I like these colors: ";

    let charLimit;
    let strs;
    let separator;
    let defaultStr;
    let initialStr;
    let truncationSuffixGenerator;

    let separatorLength = separator? separator.length : 2;
    let suffixLength = 13;

    let joinGenerator = (characterLimit) => {
            characterLimit = characterLimit || charLimit;
            console.log(characterLimit);
            console.log(strs);
            return joinWithCharLimit(
                characterLimit, 
                strs, 
                separator, 
                defaultStr, 
                initialStr, 
                truncationSuffixGenerator);
    }

    beforeEach(() => {
        strs = colors;
        defaultStr = generalStatement;
        initialStr = opener;
    });

    afterEach(() => {
        charLimit = null;
        strs = null;
        separator = null;
        defaultStr = null;
        initialStr = null;
        truncationSuffixGenerator = null;
    });

    it ('can handle empty input', () => {
        expect(joinWithCharLimit()).toEqual('');
        expect(joinGenerator())
            .toBe("I like these colors: turquoise, magenta, mauve");
        
        charLimit = null,
        strs = null;
        expect(joinGenerator()).toEqual(defaultStr);

        charLimit = 50;
        strs = ['', '', '']
        expect(joinGenerator()).toBe(defaultStr);
    });

    it("gets truncated when length > charLimit", () => {
        let normalJoin = initialStr + joinWithoutEmpties(strs);

        charLimit = normalJoin.length - 1;
        let joined = joinGenerator();

        expect(normalJoin.length).toBeGreaterThan(charLimit);
        expect(joined.length).toBeLessThanOrEqual(charLimit);
        expect(joined.length).toBeLessThan(normalJoin.length);
        expect(joined).not.toEqual(defaultStr);
        expect(joined).not.toEqual(normalJoin);
    });

    it("doesn't get truncated when length === charLimit", () => {
        let normalJoin = initialStr + joinWithoutEmpties(strs);

        charLimit = normalJoin.length;
        let joined = joinGenerator();

        expect(normalJoin.length).toBe(charLimit);
        expect(joined.length).toBeLessThanOrEqual(charLimit);
        expect(joined).toEqual(normalJoin);
    });

    it("doesn't get truncated when length < charLimit", () => {
        let normalJoin = initialStr + joinWithoutEmpties(strs);

        charLimit = normalJoin.length + 1;
        let joined = joinGenerator();

        expect(normalJoin.length).toBeLessThan(charLimit);
        expect(joined.length).toBeLessThanOrEqual(charLimit);
        expect(joined).toEqual(normalJoin);
    });

    it("can handle empty strings when truncating", () => {
        strs = ['', 'red', '', 'orange', '', '', 'blue', '', 'purple', 'indigo'];
        initialStr = null;

        charLimit = 26;
        let joined = joinGenerator();
        console.log(joined);

        expect(joined.length).toBeLessThanOrEqual(charLimit);
        expect(joined).toBe('red, orange, ...and 4 more');
    });
});