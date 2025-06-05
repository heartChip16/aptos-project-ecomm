import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---
interface Address {
    [key: string]: any; // You can replace `any` with specific keys if your address structure is known
}

interface Payment {
    [key: string]: any; // Same here – use a specific structure if available
}

interface CheckoutState {
    address: Address;
    payment: Payment;
}

// --- Initial State ---
const initialState: CheckoutState = {
    address: {},
    payment: {},
};

// --- Slice ---
const checkOutSlice = createSlice({
    name: "checkout",
    initialState,
    reducers: {
        updateAddress(state, action: PayloadAction<Partial<Address>>) {
            state.address = { ...state.address, ...action.payload };
        },
        updatePayment(state, action: PayloadAction<Partial<Payment>>) {
            state.payment = { ...state.payment, ...action.payload };
        },
        clearCheckoutInfo(state) {
            state.payment = {};
        },
    },
});

// --- Exports ---
export const { updateAddress, updatePayment, clearCheckoutInfo } = checkOutSlice.actions;
export default checkOutSlice.reducer;
