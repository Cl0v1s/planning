export type Action = {
    type: string,
}

export type DispatchAction = (action: Action) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GlobalDispatch = (fn:  (state: any, dispatch: DispatchAction) => (Promise<void> | void)) => void;