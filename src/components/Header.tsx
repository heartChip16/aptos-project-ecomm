"use client";

import { css } from '@emotion/react';
import { ShoppingCartSharp } from '@mui/icons-material';
import {
    Toolbar, Typography, alpha, TextField, Autocomplete, styled,
    AppBar, Box, Button, Badge, IconButton, Select, MenuItem, Menu, SelectChangeEvent
} from '@mui/material';
import React, { useEffect, useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getItemCount } from '../../utils';
import { fetchAllCategories } from '../feature/categories-slice';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@emotion/react';
import { useAuth } from '../firebase/Auth';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "../App.css";


import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { RootState } from '../store'; // Adjust path to your store

const Search = styled("section")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: "0",
    width: "100%"
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiTextField-root": {
        paddingRight: `calc(1em +${theme.spacing(4)})`
    },
    "& .MuiInputBase-input": {
        color: theme.palette.common.white,
    },
    "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
    },
    "& .MuiOutlinedInput-root": {
        padding: "0",
    }
}));

const SearchIconWrapper = styled("section")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    right: 0,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.common.white,
    textDecoration: "none",
}));

type ProductOption = {
    id: number;
    label: string;
};

function SearchBar() {
    const theme = useTheme();
    const products = useSelector((state: RootState) => state.products?.value);
    const categories = useSelector((state: RootState) => state.categories?.value);
    const dispatch: any = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");
    const searchTerm = searchParams.get("searchterm");

    useEffect(() => {
        setSelectedCategory(category ?? "all");
    }, [category]);

    useEffect(() => {
        if (!categories.length) {
            dispatch(fetchAllCategories());
        }
    }, [categories, dispatch]);

    function handleCategoryChange(e: SelectChangeEvent<string>) {
        const value = e.target.value;
        navigate(value === "all"
            ? "/"
            : `/?category=${value}${searchTerm ? "&searchterm=" + searchTerm : ""}`
        );
    }

    function handleSearchChange(searchText?: string) {
        if (searchText) {
            navigate(selectedCategory === "all"
                ? `?searchterm=${searchText}`
                : `/?category=${selectedCategory}&searchterm=${searchText}`
            );
        } else {
            navigate(selectedCategory === "all"
                ? `/`
                : `/?category=${selectedCategory}`
            );
        }
    }

    const productOptions: ProductOption[] = Array.from(
        selectedCategory === "all"
            ? products
            : products.filter(prod => prod.category === selectedCategory),
        prod => ({
            id: Number(prod?.id),
            label: prod.title
        })
    );

    return (
        <Search>
            <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                size="small"
                sx={{
                    mx: 1,
                    py: 0,
                    textTransform: "capitalize",
                    "&::before, &::after": { border: "none" },
                    ".MuiSelect-standard, .MuiSelect-icon": {
                        color: "common.white",
                    },
                    ".MuiInput-underline:hover": {
                        border: "none",
                        color: "white",
                    }
                }}
                variant="standard"
                labelId="selected-category"
                id="selected-category-id"
            >
                <MenuItem value="all">All</MenuItem>
                {categories?.map(category => (
                    <MenuItem
                        key={category}
                        value={category}
                        sx={{ textTransform: "capitalize", padding: 0 }}
                    >
                        {category}
                    </MenuItem>
                ))}
            </Select>

            <StyledAutocomplete
                freeSolo
                id="selected-product"
                value={selectedProduct}
                onChange={(e, value: any) => handleSearchChange(value?.label)}
                disablePortal
                options={productOptions}
                renderInput={(params) => <TextField {...params} />}
            />

            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
        </Search>
    );
}

export default function Header() {
    const { user, signOutUser } = useAuth();
    const cartItems = useSelector((state: RootState) => state.cart?.value);
    const count = getItemCount(cartItems);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);


    // for Aptos Wallet Petra: 
    const { account, signAndSubmitTransaction } = useWallet();
    const [loading, setLoading] = useState(false);



    function navigateToCart() {
        navigate("/cart");
    }

    function handleProfileMenuOpen(e: MouseEvent<HTMLElement>) {
        setAnchorEl(e.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    async function logout() {
        await signOutUser();
        navigate("/login");
    }

    function login() {
        navigate("/login");
    }

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id="user-profile-menu"
            keepMounted
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
    );

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: "green" }}>
                <Toolbar sx={{ background: "green", justifyContent: "space-between", display: "flex" }}>
                    <Typography
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ marginRight: "30px", flexGrow: 2, overflow: "visible" }}
                    >
                        <StyledLink to="/">Ingrid's Store</StyledLink>
                    </Typography>

                    <SearchBar />

                    <Box sx={{ display: "flex" }}>
                        <IconButton onClick={navigateToCart} size="large" color="inherit">
                            <Badge badgeContent={count} sx={{ ".MuiBadge-badge": { backgroundColor: "white", color: "green" } }}>
                                <ShoppingCartSharp />
                            </Badge>
                        </IconButton>
                        <WalletSelector />
                        {user ? (
                            <Button onClick={handleProfileMenuOpen} sx={{ color: "white", textTransform: "lowercase" }}>
                                {user.displayName ?? user.email}
                            </Button>
                        ) : (
                            <Button color="inherit" onClick={login}>
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </>
    );
}
