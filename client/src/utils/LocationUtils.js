export function locationDisplayName(location) {
    const city = location.city.displayName;
    const locale = location.city.state || location.city.country;
    return city + ", " + locale.displayName;
}

export function trimLocation(location) {
    return {
        displayName: locationDisplayName(location),
        metroID: location.metroArea.id
    }
}

