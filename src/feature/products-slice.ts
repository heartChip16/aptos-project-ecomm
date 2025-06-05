import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---
export interface Product {
    id: string | number; // <- allow both types
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {
        rate: number;
        count: number;
    };
}

interface ProductsState {
    value: Product[];
    loading: boolean;
}

// --- Async Thunk ---
export const fetchAllProducts = createAsyncThunk<Product[]>(
    'products/fetchAll',
    async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        return await response.json();
    }
);

// --- Initial State ---
const initialState: ProductsState = {
    value: [],
    loading: false,
};

// --- Slice ---
const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.value = action.payload;
            state.loading = false;
        });
    },
});

// --- Exports ---
export default productsSlice.reducer;
