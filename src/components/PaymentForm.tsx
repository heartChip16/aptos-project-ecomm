import React, { ChangeEvent, useState } from 'react';
import {
    Box,
    TextField,
    Grid,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updatePayment } from '../feature/checkout-slice';
import { RootState } from '../store'; // Adjust if your store type is elsewhere
import { AppDispatch } from '../store'; // Adjust this too

interface Payment {
    method?: string;
    name?: string;
    cardNumber?: string;
    expDate?: string;
    cvv?: string;
}

export default function PaymentForm(): JSX.Element {
    const payment: Payment = useSelector((state: RootState) => state.checkout?.payment);
    const dispatch: AppDispatch = useDispatch();
    const [method, setMethod] = useState<string>(payment?.method ?? 'card');

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const { name, value } = event.target;
        dispatch(updatePayment({ [name]: value }));
    }

    function handleMethodChange(event: SelectChangeEvent<string>): void {
        const value = event.target.value;
        setMethod(value);
        dispatch(updatePayment({ method: value }));
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Payment Method
            </Typography>

            <FormControl sx={{ mb: 3, minWidth: 200 }}>
                <InputLabel id="payment-method-label">Select Method</InputLabel>
                <Select
                    labelId="payment-method-label"
                    id="payment-method"
                    value={method}
                    label="Select Method"
                    onChange={handleMethodChange}
                >
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="crypto">Aptos Crypto</MenuItem>
                </Select>
            </FormControl>

            {method === 'card' ? (
                <Box component="form" >
                    <Grid container spacing={3} sx={{ mb: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                id="name"
                                variant="standard"
                                required
                                label="Name on card"
                                fullWidth
                                autoComplete="cc-name"
                                defaultValue={payment?.name ?? ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="cardNumber"
                                id="cardNumber"
                                variant="standard"
                                required
                                label="Card Number"
                                fullWidth
                                autoComplete="cc-number"
                                defaultValue={payment?.cardNumber ?? ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="expDate"
                                id="expDate"
                                variant="standard"
                                required
                                label="Expiry Date"
                                fullWidth
                                autoComplete="cc-exp"
                                defaultValue={payment?.expDate ?? ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="cvv"
                                id="cvv"
                                variant="standard"
                                required
                                label="CVV"
                                fullWidth
                                type="password"
                                autoComplete="cc-csc"
                                defaultValue={payment?.cvv ?? ''}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Typography sx={{ mt: 2, fontStyle: 'italic' }} color="text.secondary">
                    Pay with Aptos Crypto Coin using your Petra Wallet after Review Order.
                </Typography>
            )}
        </>
    );
}
