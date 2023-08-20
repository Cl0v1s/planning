export interface Role {
    /**
     * Role's name
     */
    name: string,
    /**
     * Role's duration, in days
     * How often the role must be reaffected
     */
    duration: number,
    /**
     * If the person with this role can be away
     * for a few days
     */    
    fullTime: boolean,
}