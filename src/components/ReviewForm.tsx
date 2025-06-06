import React, { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';

import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network, Hex } from "@aptos-labs/ts-sdk";


import {
    List,
    ListItem,
    ListItemText,
    Grid,
    Typography
} from '@mui/material';
import { getSubtotal } from '../../utils';
import { RootState } from '../store'; // Adjust path based on your project structure

import { updatePayment } from '../feature/checkout-slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store'; // Adjust this too

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
    method?: string;
    insufficientBalance?: boolean;
    totalRequired?: number;
}

export default function ReviewForm(): JSX.Element {

    const dispatch: AppDispatch = useDispatch();

    const cart: CartItem[] = useSelector((state: any) => state.cart.value);
    const address: Record<string, string> | null = useSelector((state: RootState) => state.checkout.address);
    const addresses: string[] = address ? Object.values(address) : [];


    const { account, signAndSubmitTransaction } = useWallet();
    const [loading, setLoading] = useState(false);

    const [balance, setBalance] = useState<number | null>(null);

    const [isInsufficient, setIsInsufficient] = useState(false);

    const gasBuffer = 0.002; // Adjust this buffer as needed
    const gasBufferOctas = gasBuffer * 1e8; // convert to Octas

    //client setup 
    const config = new AptosConfig({ network: Network.TESTNET })
    const aptos = new Aptos(config);

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

    // function toHexAddress(address: Uint8Array | string): string {
    //     if (typeof address === "string") return address;
    //     return "0x" + Array.from(address).map((b) => b.toString(16).padStart(2, "0")).join("");
    // }


    useEffect(() => {
        async function fetchBalance() {
            console.log('inside fetch balance');
            console.log('account.address ', account?.address);
            if (account?.address) {
                try {

                    // const addressHex = toHexAddress(account.address);

                    const result = await aptos.getAccountAPTAmount({
                        accountAddress: account.address.toString(),
                    });

                    setBalance(Number(result));
                    console.log('result ', result);
                } catch (error) {
                    console.error("Failed to fetch balance:", error);
                }
            }
        }

        fetchBalance();
    }, [account?.address]);

    const getAptosDetails = async (account: any, balance: any) => {

        console.log('account inside getAptosDetails ', account);
        console.log('balance inside getAptosDetails ', balance);
        if (!account) return;
        setLoading(true);

        console.log('account ', account);
        // account contains address 
        // 1. Get Current Balance of Petra Wallet connected
        // 2. Get the total amount to pay, converted into Aptos
        //      For now, let's assign a fixed USD to Aptos rate of
        //          1 APT  /  4.65 USD 
        //      So  APT amount = Total Amount to pay in USD/ 4.65 USD
        // 3. If Current Balance < amount to pay + gas fees, disable the Place Order button
        // and add notification "Cannot place order using Aptos Wallet connected. Insufficient balance."
        // 4. If Current Balance > amount to pay + gas fees, enable Place Order button. 
        //5. When user clicks Place Order button, transfer the Aptos payment to the fixed Aptos address of the seller. Aptos address is 0x44d278a312851f7c8094e607e182581298ec868b77f7051713db8bb71c927163


        try {



            // 1. Get Current Balance of Petra Wallet connected
            //     equal to balance

            //2.  Get the total amount to pay, converted into Aptos
            const USD_APTOS_RATE = 4.65;
            let totalAptosToPay = getSubtotal(cart) / USD_APTOS_RATE;  //in APTOS

            console.log('total ', getSubtotal(cart));
            console.log('totalAptosToPay ', totalAptosToPay);

            // 3. If Current Balance < amount to pay + gas fees, disable the Place Order button
            // and add notification "Cannot place order using Aptos Wallet connected. Insufficient balance."
            // 4. If Current Balance > amount to pay + gas fees, enable Place Order button. 
            if (balance == null || totalAptosToPay == null) return;

            const totalAptosToPayOctas = totalAptosToPay * 1e8;
            const totalRequired = totalAptosToPayOctas + gasBufferOctas;

            if (balance < totalRequired) {
                setIsInsufficient(true);
                dispatch(updatePayment({ insufficientBalance: true }));
            } else {
                setIsInsufficient(false);
                dispatch(updatePayment({ insufficientBalance: false, totalRequired: totalRequired }));
                console.log('totalrequired in REVIEWFORM ', totalRequired);

            }

            // build transaction 
            // const transaction: InputTransactionData = {
            //     data: {
            //         function: "6f4444a301c6bd6fac634a3749adf97d9de56d6221c09cea541060576ca84752::nft_launchpad::mint_token",
            //         functionArguments: [],
            //         typeArguments: [],
            //     },
            //     sender: account.address,
            // }


            // // sign and submit transaction 
            // const response = await signAndSubmitTransaction(transaction);
            // await aptos.waitForTransaction({ transactionHash: response.hash });
            // alert("NFT Minted Successfully!");


        } catch (error) {
            console.error(error);
            alert("Failed to pay APTOS coins from Petra wallet account.");
        } finally {
            setLoading(false);
        }

    }

    // useEffect(() => {
    //     console.log('payment', payment);


    //     // check if payment?.method === 'crypto', if so, get the petra wallet address 
    //     if (payment?.method === 'crypto') {
    //         getAptosDetails(account, balance);
    //     }

    // }, [payment, account, balance]);

    useEffect(() => {
        console.log('payment IN REVIEW FORM', payment);


        // check if payment?.method === 'crypto', if so, get the petra wallet address 
        if (payment?.method === 'crypto') {
            getAptosDetails(account, balance);
        }

    }, [payment?.method, balance]);

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
