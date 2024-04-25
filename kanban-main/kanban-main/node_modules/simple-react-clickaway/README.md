# Simple React Clickaway Hook

Simple react `useClickAway` hook, which listens for clicks outside the element.

## Installation

```
npm i simple-react-clickaway
```

Import hook

```js
import {useClickAway} from 'simple-react-clickaway';
```

And use it like:

```js
const {disable, enable} = useClickAway(ref, onClickAway);
```

## Example

Here is a simple example of detecting a click outside a modal window:

```js
import "./styles.css";
import { useClickAway } from "simple-react-clickaway";
import { useRef } from "react";

export default function App() {
  const modalRef = useRef();
  const handleClickAway = () => {
    alert("You clicked away!");
  };
  const { disable, enable } = useClickAway(modalRef, handleClickAway);
  return (
    <div className="App">
      <div className="modal" ref={modalRef}>
        <button onClick={disable}>Disable click away</button>
        <button onClick={enable}>Enable click away</button>
      </div>
    </div>
  );
}
```
[View it on a code sandbox](https://codesandbox.io/s/simple-react-clickaway-qduck)
