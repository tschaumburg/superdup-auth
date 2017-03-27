export interface UserInfo
{
    /**
    * A (system-wide) unique ID for this user.
    *
    * This is used as a key for permissions, settngs, userdata,
    * payment history etc., so it is VITAL that this id is
    *
    *   - constant: you don't want to lose your payment history
    *     because someone reinstalled a server
    *   - unique:
    *
    * The ID does not, however, have to be human readable
    * - "AX234*1122!DHDE23EO23" is quite OK.
    */
    readonly uid: string;

    /**
    * A unique handle for this user, used for presentation to humans.
    * - "ninja123" and other silly handles.
    *
    * Should probably be unique, and non-reusable
    */
    readonly handle: string;

    /**
    *
    */
    givenName: string;

    /**
    *
    */
    familyName: string;

    /**
    *
    */
    picture: string;

    idtoken: string;

    idtokenClaims: {};
}
