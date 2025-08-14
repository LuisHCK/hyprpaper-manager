import { JSX } from 'preact/jsx-runtime';

export function Button({ children, ...props }: JSX.HTMLAttributes<HTMLButtonElement>) {
	return <button {...props}>{children}</button>;
}
