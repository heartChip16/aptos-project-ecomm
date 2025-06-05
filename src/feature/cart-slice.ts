import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---
interface Product {
    id: string | number;
    price: number;
    [key: string]: any; // for additional dynamic product fields
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    value: CartItem[];
}

// --- Initial State ---
const initialState: CartState = {
    value: [],
};

// --- Slice ---
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const { product, quantity } = action.payload;
            const existingItem = state.value.find(
                ({ product: prod }) => prod.id === product.id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.value.push(action.payload);
            }
        },
        removeFromCart(state, action: PayloadAction<CartItem>) {
            const { product } = action.payload;
            const existingItem = state.value.find(
                ({ product: prod }) => prod.id === product.id
            );
            const index = state.value.findIndex(
                ({ product: prod }) => prod.id === product.id
            );

            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                state.value.splice(index, 1);
            }
        },
        clearCart(state) {
            state.value = [];
        },
    },
});

// --- Exports ---
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
