import React from 'react';
import "./Slider.css"

const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
range = document.querySelector(".slider .progress");
let priceGap = 1000;

priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

        if((maxVal - minVal) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = maxVal - priceGap
            }else{
                rangeInput[1].value = minVal + priceGap;
            }
        }else{
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});

const Slider = () => {
    return (
       <>
    <div className="wrapper">
      <header>
        <h2>Price Range</h2>
        <p>Use slider or enter min and max price</p>
      </header>
      <div className="price-input">
        <div className="field">
          <span>Min</span>
          <input type="number" className="input-min" value="2500">
        </div>
        <div className="separator">-</div>
        <div className="field">
          <span>Max</span>
          <input type="number" className="input-max" value="7500">
        </div>
      </div>
      <div className="slider">
        <div className="progress"></div>
      </div>
      <div className="range-input">
        <input type="range" class="range-min" min="0" max="10000" value="2500" step="100">
        <input type="range" class="range-max" min="0" max="10000" value="7500" step="100">
      </div>
    </div>
       </>
    )}

export default Slider;
