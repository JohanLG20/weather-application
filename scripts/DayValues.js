class DayValues{
    /*
        d: A string that contain the day concerned by the values, in the UTC format
        ti: An array that contains all the possible that are displayed
        val: An that contains the values of the day that the user already requested. The keys are the name of the values in the API.

        The index of the arrays are matched, the i value correspond to the i time.
    */
    constructor(d, ti, val, un, di){
        this.day = d
        this.time = ti
        this.values = val
        this.unit = un
        this.unitDisplayed = di

    }

}