use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn square(number: f64) -> f64 {
    number * number
}