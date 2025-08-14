import { JSX } from 'preact/jsx-runtime';

type CheckboxProps = JSX.HTMLAttributes<HTMLInputElement> & {
	label?: string;
};

export function Checkbox({ label, ...props }: CheckboxProps) {
	return (
		<label>
			<input type="checkbox" {...props} />
			{label && <span>{label}</span>}
		</label>
	);
}
