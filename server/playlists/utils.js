function joinWithoutEmpties(strs, separator) {
    strs = strs || [];
    separator = separator || ', ';

    return strs.reduce((strSoFar, str) => {
        if (str) {
            strSoFar.length > 0 ? 
                strSoFar += separator + str :
                strSoFar += str
        }
        return strSoFar;
    }, '');
}

/**
 * Joins an array of strings to form a string whose max length is the character limit, adding a suffix if there are
 * still more strings to join after the character limit has been reached.
 * 
 * @param {number} charLimit 
 * @param {string[]} strs 
 * @param {string} [separator] string with which to separate the strings, default is ', '
 * @param {string} [defaultStr] the default string to return if the first string is over the character limit
 * @param {string} [initialStr] the string to which to concatentate the rest of the strings
 * @param {function} [truncationSuffixGenerator] (numStrsLeftToAdd) => suffix; default suffix is `...and ${strsLeft} more`
 */

function joinWithCharLimit(characterLimit, strs, separator, defaultStr, initialStr, truncationSuffixGenerator) {
    initialStr = initialStr || '';
    defaultStr = defaultStr || '';
    separator = separator || ', ';
    strs = strs || [];

    let joined = joinWithoutEmpties(strs, separator);
    if (joined) joined = initialStr + joined;
    if (!characterLimit || joined.length <= characterLimit) {
        return joined || defaultStr;
    }

    const truncationSuffix = truncationSuffixGenerator || 
        function (descriptionsLeft) {
            return `...and ${descriptionsLeft} more`;
        };

    const strWillOverflow = (str, strToAdd, strsLeft) => {
        const newStrLength = str.length + strToAdd.length;
        return (newStrLength > characterLimit) || 
            (strsLeft > 1 && 
            newStrLength + separator.length + 
            truncationSuffix(strsLeft - 1).length > characterLimit);
    }

    let joinedStr = initialStr;
    for (let i = 0; i < strs.length; i++) {
        if (!strs[i]) continue;
        let strsLeft = strs.length - i;
        if (joinedStr !== initialStr) {
            joinedStr += separator;
        }
        if (strWillOverflow(joinedStr, strs[i], strsLeft)) {
            joinedStr !== initialStr ? 
                joinedStr += truncationSuffix(strsLeft) :
                joinedStr = defaultStr;
            break;
        } else {
            joinedStr += strs[i];
        }
    }

    return joinedStr;
}

module.exports = { joinWithCharLimit, joinWithoutEmpties };