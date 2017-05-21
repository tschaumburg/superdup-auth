import jwtdecode = require("jwt-decode");

    export function getExpiration(jwtToken: string): number
    {
        if (!jwtToken)
            return 0;

        var decoded = jwtdecode(jwtToken);
        return decoded.exp;
        //return jwt.decode(jwtToken).exp;
        //return 0;
    }

    export function isExpired(expiration: number): boolean
    {
        return (expiration < Date.now() / 1000);
    }
