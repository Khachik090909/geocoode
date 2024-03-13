import React, { useEffect, useState } from "react";

function FooyerModal({ dataLenght, setLimit }) {
  const [buttons, setButtons] = useState([]);
  const [buttonClick, setButtonClick] = useState(1);
  useEffect(() => {
    const element = [];
    for (let i = 0; i < Math.ceil(dataLenght / 15); i += 1) {
      element.push(i + 1);
    }
    if (element.length > 20) {
      if (buttonClick < 10) {
        setButtons(element.slice(0, 20));
      } else if (buttonClick > element.length - 10) {
        setButtons(element.slice(element.length - 20, element.length));
      } else {
        setButtons(element.slice(buttonClick - 10, buttonClick + 10));
      }
    } else {
      setButtons(element);
    }
    setLimit(buttonClick);
  }, [buttonClick, dataLenght]);

  return (
    <div>
      {buttonClick !== 1 && (
        <button
          type="button"
          className="slice-button"
          onClick={() => setButtonClick(buttonClick - 1)}
        >
          ←
        </button>
      )}
      {buttons.length > 1 &&
        buttons.map((elem) => (
          <button
            type="button"
            className="slice-button"
            key={elem}
            id={elem}
            onClick={() => setButtonClick(elem)}
            style={{
              color: buttonClick === elem ? "rgb(148, 231, 15)" : "white",
            }}
          >
            {elem}
          </button>
        ))}
      {buttonClick !== buttons.length && (
        <button
          type="button"
          className="slice-button"
          onClick={() => setButtonClick(buttonClick + 1)}
        >
          →
        </button>
      )}
    </div>
  );
}

export default FooyerModal;
