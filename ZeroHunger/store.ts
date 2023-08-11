interface Istore {
    isReady: boolean,
    dispatch: (obj: { type: string, payload: object }) => void
}

const store: Istore = {
    isReady: false,
    dispatch: () => {
        console.error('store is NOT ready')
    },
}

export default store