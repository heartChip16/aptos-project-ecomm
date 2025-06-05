import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import {
    List,
    ListItem,
    ListItemText,
    Grid,
    Typography
} from '@mui/material';
import { getSubtotal } from '../../utils';
import { RootState } from '../store'; // Adjust path based on your project structure

interface Product {
    title: string;
    price: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface Payment {
    cardNumber?: string;
    name?: string;
    expDate?: string;
}

export default function ReviewForm(): JSX.Element {
    const cart: CartItem[] = useSelector((state: any) => state.cart.value);
    const address: Record<string, string> | null = useSelector((state: RootState) => state.checkout.address);
    const addresses: string[] = address ? Object.values(address) : [];

    const payment: Payment | null = useSelector((state: RootState) => state.checkout.payment);
    const payments =
        payment && payment.cardNumber && payment.name && payment.expDate
            ? [
                { name: 'Card type', detail: 'Visa' },
                { name: 'Card Number', detail: payment.cardNumber },
                { name: 'Card Holder', detail: payment.name },
                { name: 'Expiry Date', detail: payment.expDate }
            ]
            : [];

    const theme: any = useTheme();

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>
            <List disablePadding>
                {cart?.map(({ product, quantity }) => (
                    <ListItem key={product.title} sx={{ py: 1, px: 0 }}>
                        <ListItemText
                            sx={{
                                '& .MuiListItemText-primary': { fontWeight: 500 },
                                '& .MuiListItemText-secondary': { fontSize: theme.spacing(2) }
                            }}
                            primary={product.title}
                            secondary={`Qty: ${quantity}`}
                        />
                        <Typography variant="body2">
                            {getSubtotal([{ product, quantity }]).toFixed(2)}
                        </Typography>
                    </ListItem>
                ))}
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        ${getSubtotal(cart).toFixed(2)}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Shipping
                    </Typography>
                    <Typography>{addresses.join(', ')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Payment Details
                    </Typography>
                    <Grid container>
                        {payments.map(({ name, detail }) => (
                            <React.Fragment key={name}>
                                <Grid item xs={6}>
                                    <Typography>{name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{detail}</Typography>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
