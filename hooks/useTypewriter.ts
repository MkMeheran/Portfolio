import { useEffect, useRef, useState } from "react";

export default function useTypewriter(
  text: string = "",
  speed: number = 80
) {
  const [displayed, setDisplayed] = useState("");
  const genRef = useRef(0);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      return;
    }

    const myGen = ++genRef.current;
    let i = 0;

    // শুধু একবার render এর সময় reset করো
    setDisplayed("");

    const id = setInterval(() => {
      if (genRef.current !== myGen) return;

      if (i < text.length) {
        // প্রতি tick এ substring দাও → skip/double কোনো chance নেই
        setDisplayed(text.substring(0, ++i));
      } else {
        clearInterval(id);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return displayed;
}
