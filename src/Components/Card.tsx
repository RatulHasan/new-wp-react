export const Card = ({children, className}: any) => {
    return (
        <div className={className ? className : `overflow-hidden bg-white shadow sm:rounded-lg py-8 px-8`}>
            {children}
        </div>
    )
}

// @ts-ignore
window.Card = Card;
