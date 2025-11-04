export const ROUTE = {
    MEME_CARD_DELETE: '/card/{id}/delete'
}

export type ROUTE = typeof ROUTE[keyof typeof ROUTE]
