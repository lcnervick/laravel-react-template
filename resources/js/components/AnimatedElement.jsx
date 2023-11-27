import React, { Children } from 'react';
import { useInView } from 'react-intersection-observer';

const defaultOptions = {
	rootMargin: '0px',
	delay: 0,
	triggerOnce: true,
	initialInView: false
};

function ThisAnimatedElement({Child, animate, opts}) {
	const { ref, inView } = useInView(opts);
	return (
		<Child.type
			{ ...Child.props }
			className={`${Child.props.className || ''} ${animate + (inView ? ' active' : '')}`}
			ref={ref}
		/>
	)
}

export default function AnimatedElement({animate, options = {}, children}) {
	const opts = {
		...defaultOptions,
		...options
	}
	
	// enable iteration of any children in the AnimatedElement so as to apply animation to all
	const elements = Children.toArray(children);

	// split multiple animations, add animate- prefix for class name
	let animations = animate.split(/\s+/);
	for(let a in animations) {
		animations[a] = `animate-${animations[a]}`;
	}
	animate = animations.join(' ');

	return (<>
		{
			// iterate all children and add class and inView ref
			Children.map(elements, (Child, index) => (
				<ThisAnimatedElement opts={opts} Child={Child} animate={animate} />
			))
			
			// ~~ OR ~~

			// Children.map(elements, (child, index) =>
			// 	cloneElement(child, {
			// 		className: `${child.props.className || ''} ${"animate-" + animate + (inView ? ' active' : '')}`,
			// 		ref: ref
			// 	})
			// )
		}
	</>);
}
