import { JSX } from 'preact/jsx-runtime';

type InputProps = JSX.HTMLAttributes<HTMLInputElement> & {
	label?: string;
};

export function Input({ label, ...props }: InputProps) {
	return (
		<label>
			{label && <span>{label}</span>}
			<input type="text" {...props} />
		</label>
	);
}
