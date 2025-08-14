import { JSX } from 'preact/jsx-runtime'

export function Card({ children, ...props }: JSX.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="card" {...props}>
            <div className="card-content">{children}</div>
        </div>
    )
}
