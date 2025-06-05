import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// --- Async Thunk ---
export const fetchAllCategories = createAsyncThunk<string[]>(
    "categories/fetchAll",
    async () => {
        const response = await fetch("https://fakestoreapi.com/products/categories");
        return await response.json();
    }
);

// --- Types ---
interface CategoriesState {
    value: string[];
    loading: boolean;
}

// --- Initial State ---
const initialState: CategoriesState = {
    value: [],
    loading: false,
};

// --- Slice ---
const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllCategories.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
            state.value = action.payload;
            state.loading = false;
        });
    },
});

// --- Export ---
export default categoriesSlice.reducer;
