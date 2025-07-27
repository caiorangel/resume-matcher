import { cn } from '@/lib/utils';

/**
 * BackgroundContainer Component
 *
 * Provides a full-screen section with a sophisticated gradient background
 * and a inner container. It accepts children elements to render 
 * inside the inner container.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the container.
 * @param {string} [props.className] - Optional additional class names for the section element.
 * @param {string} [props.innerClassName] - Optional additional class names for the inner div element.
 * @returns {JSX.Element} The rendered BackgroundContainer component.
 */

interface BackgroundContainerProps {
	children: React.ReactNode;
	className?: string;
	innerClassName?: string;
}

const BackgroundContainer = ({
	children,
	className,
	innerClassName,
}: BackgroundContainerProps) => {
	return (
		<section
			className={cn(
				'relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900/90 to-purple-900/90',
				className,
			)}
		>
			{/* Subtle geometric pattern overlay */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-0 left-0 w-full h-full" style={{
					backgroundImage: `radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 20%),
					                  radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 20%)`,
					backgroundSize: '600px 600px'
				}} />
			</div>
			
			{/* Inner container with padding and rounded corners */}
			<div
				className={cn(
					'relative z-10 flex w-full max-w-8xl flex-col items-center justify-center p-6 rounded-3xl',
					innerClassName,
				)}
			>
				{/* Render children content */}
				<div className="relative z-10 w-full flex flex-col items-center justify-center">
					{children}
				</div>
			</div>
		</section>
	);
};

export default BackgroundContainer;
