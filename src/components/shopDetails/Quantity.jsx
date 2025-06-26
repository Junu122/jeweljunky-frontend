import { useEffect, useState } from "react";

export default function Quantity({ setQuantity = (value) => {},maxvalue }) {
  console.log(maxvalue,"maxvalue")
  const [count, setCount] = useState(1);
  useEffect(() => {
    setQuantity(count);
  }, [count]);

  return (
    <div className="wg-quantity">
      <span
        className="btn-quantity minus-btn"
        onClick={() => setCount((pre) => (pre == 1 ? 1 : pre - 1))}
      >
        -
      </span>
      <input
        min={1}
        max={maxvalue}
        type="text"
        onChange={(e) => setCount(e.target.value / 1)}
        name="number"
        value={count}
      />
      <span
        className="btn-quantity plus-btn"
        onClick={() => setCount((pre) => pre === maxvalue?maxvalue:pre + 1)}
      >
        +
      </span>
    </div>
  );
}
