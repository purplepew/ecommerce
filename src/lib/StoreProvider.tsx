import { Provider } from 'react-redux'
import { store } from './store'
import { ReactNode } from 'react'


type Props = { children: ReactNode }

function StoreProvider({ children }: Props) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default StoreProvider