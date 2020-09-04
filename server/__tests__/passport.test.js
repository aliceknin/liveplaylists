const PassportConfig = require("../config/passport");

test("can access from this file", () => {
    const params = PassportConfig.getDbUserParams({
        displayName: "Alice",
        id: "1",
        desire: "sleep"
    }, "hrij498guigehjfeworjk");
    expect(params).toEqual({
        name: "Alice",
        spotifyID: "1",
        refreshToken: "hrij498guigehjfeworjk"
    });
});