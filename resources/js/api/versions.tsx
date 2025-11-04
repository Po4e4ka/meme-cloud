export const VERSION = {
    V1: '/v1'
}

export type VERSION = typeof VERSION[keyof typeof VERSION]
