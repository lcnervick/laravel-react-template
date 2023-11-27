import { useState, useMemo, useEffect, useContext, createContext } from 'react';
import pleaseWait from '../../images/please-wait.gif';
import '../../css/components/PleaseWait.css';

const PleaseWaitContext = createContext({
	waiting: () => {},
});


export function PleaseWait({visible}) {
	return (visible ? <>
		<div className="please-wait-shadowbox">
			<div className='please-wait-container'>
				<img className="please-wait-image" src={pleaseWait} alt="please wait" />
				<div className='please-wait-text'>Loading, Please Wait...</div>
			</div>
		</div>
	</> : '');
}

export function PleaseWaitProvider({children}) {
	const [isLoading, setIsLoading] = useState(false);
	
	const waiting = (status) => {
		setIsLoading(!!status)
	}

	const providerValues = useMemo(() => ({
		waiting,
		isWaiting: !!isLoading
	}), [waiting]);

	return (
		<PleaseWaitContext.Provider value={providerValues}>
			{children}
			<PleaseWait visible={isLoading} />
		</PleaseWaitContext.Provider>
	);
}

export default function usePleaseWait() {
	return useContext(PleaseWaitContext);
}
