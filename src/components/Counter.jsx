import { useState, useEffect, useRef } from "react"

const buttonStyle1 = "p-2 rounded-sm"
const buttonStyle2 = buttonStyle1+" bg-red-600 text-white"

const initialCount = Number(localStorage.getItem("count"));
const initialStep = Number(localStorage.getItem("step"));
const initialCountHistory = JSON.parse(localStorage.getItem("countHistory"));

function Counter() {
    const [countHistory,setCountHistory] = useState(initialCountHistory || [0]);
    const [count,setCount] = useState(initialCount || 0);
    const [step,setStep] = useState(initialStep || 1);
    const [saving,setSaving] = useState(false);
    const isMounted = useRef(false);

    useEffect(()=>{
        if (!isMounted.current) {
            isMounted.current = true; // Set to true after the first render
            return; // Skip the effect's logic on the first render
        }
        if(countHistory.length > 0){
            setCountHistory([...countHistory,count]);
        }
    },[count])

    useEffect(()=>{
        setSaving(true);
        const save = setTimeout(() => {
            
            localStorage.setItem("count",count);
            localStorage.setItem("step",step);
            localStorage.setItem("countHistory",JSON.stringify(countHistory));
            setSaving(false);
            console.log("Saved to Local Storage")

        }, 1000);
        return () => {
            clearTimeout(save);
        }
    },[step,count,countHistory])

    useEffect(()=>{
        document.addEventListener("keydown",handleKeyDown);
        return () => {
            document.removeEventListener("keydown",handleKeyDown);
        }
    },[]);

    const handleKeyDown = (e) => {
        if(e.key == "ArrowUp"){
            setCount((prev)=>prev+step);
        }
        else if (e.key == "ArrowDown"){
            setCount((prev)=>prev-step);
        }
    }

  return (
    <>
    <div className="flex flex-col gap-4 items-center bg-white shadow-lg  rounded max-w-md p-4">
        
        <h2>Counter</h2>
        <div>Current Count: {count}</div>
        <div className="flex gap-4">
            <button onClick={()=>setCount(count-step)} className={buttonStyle1}>Decrement</button>
            <button onClick={()=>setCount(count+step)} className={buttonStyle1}>Increment</button>
            <button onClick={()=>{setCount(0);setStep(1);setCountHistory([0])}} className={buttonStyle2}>Reset</button>
        </div>
        <div>
            <label htmlFor="step">Step Value: </label>
            <input type="number" name="step" value={step} min={1} aria-label="Increment or decrement by this number" onChange={(e)=>{setStep(Number(e.target.value))}} />
        </div>
        {!saving && (<p>Changes saved.</p>)}
        {saving && (<p>Saving to localStorage...</p>)}
        <div className="w-full">
            <h3>Count History:</h3>
            <ul>
                {countHistory.map((number,index)=>
                    <li key={index} className="border-t border-gray-200">{number}</li>
                )}
            </ul>
        </div>

    </div>
    </>
  )
}

export default Counter
