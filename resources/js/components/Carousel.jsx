import React, { useEffect, useRef, useState } from 'react';
import '../../css/components/Carousel.css';

export default function Carousel({children}) {
	const cardContainerRef = useRef(null);
	const [index, setIndex] = useState(null);
	const [offset, setOffset] = useState(0);
	const [cardWidth, setCardWidth] = useState(0);
	const [parentWidth, setParentWidth] = useState(0);
	const [containerWidth, setContainerWidth] = useState(0);
	const [leftMargin, setLeftMargin] = useState(0);
	const [clickDisabled, setClickDisabled] = useState(false);

	let animationTimeout = null;

	useEffect(() => {
		getElementSizes();
		window.addEventListener('resize', getElementSizes)
		return () => {
			window.removeEventListener('resize', getElementSizes);
		}
	}, [cardWidth, containerWidth, parentWidth]);

	const getElementSizes = () => {
		setCardWidth(cardContainerRef.current.childNodes[0].offsetWidth + 20);
		setParentWidth(cardContainerRef.current.parentNode.offsetWidth);
		setContainerWidth(children.length * cardWidth);
		if(index !== null) 
			setLeftMargin((parentWidth - cardWidth) / 2);
		else 
			settleCard(getMiddleCard());
		// settleCard(index);
		// console.log(containerWidth, cardWidth, leftMargin);
	}

	const getMiddleCard = () => {
		const middleCard = Math.ceil(((parentWidth / 2) - offset)/cardWidth);
		console.log('middle card', middleCard);
		return isNaN(middleCard) ? 0 : middleCard;
	}

	console.log('current card', parentWidth, offset, cardWidth, Math.round(((parentWidth / 2) - offset)/cardWidth))

	const disableClick = () => {
		if (!clickDisabled) {
			for (const card of cardContainerRef.current.childNodes) {
				if (card.prevclick) continue;
				card.prevclick = card.onclick;
				card.onclick = (e) => {e.preventDefault();};
			};
			setClickDisabled(true);
		}
	};

	const enableClick = () => {
		setTimeout(() => {
			for (const card of cardContainerRef.current.childNodes) {
				card.onclick = card.prevclick;
				delete card.prevclick;
			};
		}, 10)
		setClickDisabled(false);
	};

	const settleCard = (frame) => {
		const leftPosition = ((cardWidth * frame * -1) + leftMargin);

		cardContainerRef.current.style.transition = "left 0.5s ease-out";
		cardContainerRef.current.style.left = leftPosition + 'px';

		setIndex(frame);
		setOffset(leftPosition);
		setTimeout(() => {
			cardContainerRef.current.style.transition = "none";
		}, 500)
	}
	
	const handlePointerEvent = (e) => {
		e.preventDefault();
		clearTimeout(animationTimeout);
		console.log("Pointer Start")
		let moveAmt = 0;

		let isTouchEvent = e.type === "touchstart" ? true : false;
		let initialX = isTouchEvent ? e.touches[0].clientX : e.clientX;

		if(isTouchEvent) {
			document.ontouchmove = onPointerMove;
			document.ontouchend = onPointerEnd;
		} else {
			document.onmousemove = onPointerMove;
			document.onmouseup = onPointerEnd;
		}

		function onPointerMove(e) {
			e.preventDefault();
			let thisMove = (isTouchEvent ? e.touches[0].clientX : e.clientX) - initialX;
			// if this moves past the boundaries, stop recording move amounts and stop scrolling
			if (offset + thisMove - leftMargin < 0 && offset + thisMove + leftMargin > parentWidth - containerWidth) {
				moveAmt = thisMove;
				cardContainerRef.current.style.left = (offset + moveAmt) + 'px';
				if (Math.abs(moveAmt) > 10) {
					disableClick();
				}
			} else {
				disableClick();
			}
		}
		
		function onPointerEnd(e) {
			const left = cardContainerRef.current.offsetLeft;
			const frame = Math.round(Math.abs(left - (cardWidth/2)) / (cardWidth));
			
			enableClick();
			settleCard(frame);

			if(isTouchEvent) {
				document.ontouchmove = null;
				document.ontouchend = null;
			} else {
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}
	}

	return (<div className="carousel-outer-container">
		<button className={"carousel-nav left" + (index === 0 ? ' hidden' : '')} onClick={(e) => {settleCard(index-1)}}><div /></button>
		<div className='carousel-container'>
			<div className="carousel-card-container" onMouseDown={handlePointerEvent} onTouchStart={handlePointerEvent} ref={cardContainerRef} >
				{children}
			</div>
		</div>
		<button className={"carousel-nav right" + (index === children.length-1 ? ' hidden' : '')} onClick={(e) => {settleCard(index+1)}}><div /></button>
		</div>);
}
