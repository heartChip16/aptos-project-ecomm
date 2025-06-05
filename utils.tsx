// utils.tsx
import React from 'react'

type Product = {
    price: number
}

type CartItem = {
    product: Product
    quantity: number
}

export function getItemCount(cartItems: CartItem[]): number {
    return cartItems.reduce((count, cartItem) => cartItem.quantity + count, 0)
}

export function getSubtotal(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, { product, quantity }) => product.price * quantity + sum, 0)
}
