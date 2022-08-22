import React from 'react';
import Plot from 'react-plotly.js';

///////////////////////////////////////////////////////////////////////////////////////////
// COMBINE THE FOLLOWING TWO COMPONENTS IN ORDER TO MAKE THEM INTO THE RACT FORWARD REF ONE
///////////////////////////////////////////////////////////////////////////////////////////

class App extends React.Component {
  render() {
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
      />
    );
  }
}

const PlotComponent = React.forwardRef(({style, className, ...props}, ref) => {
  return (
    <div {...props} className={className} ref={ref}>
    </div>
  );
})

import React, { useState, useRef, forwardRef } from 'React';

const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

const App = () => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const onInputChange = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <Input value={value} onChange={onInputChange} ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </>
  );
};
