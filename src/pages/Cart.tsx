import { useTheme } from '@emotion/react';
import { Button, Grid } from '@mui/material'
import { Typography } from '@mui/material';
import { CardContent } from '@mui/material';
import { Rating } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { CardMedia } from '@mui/material';
import { Card } from '@mui/material';
import { Container } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import StarIcon from '@mui/icons-material/Star';
import { getSubtotal } from '../../utils';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../feature/cart-slice';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const theme = useTheme();
    const cart = useSelector(state => state.cart?.value);
    let total = getSubtotal(cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function updateQuantity(e, { product, quantity }) {
        const updatedQuantity = e.target.valueAsNumber;
        if (updatedQuantity < quantity) {
            dispatch(removeFromCart({ product }));
        } else {
            dispatch(addToCart({ product }));
        }
    }

    function checkOutItems() {
        navigate("/checkout");
    }

    function goToHome() {
        navigate("/");
    }

    return <Container sx={{ py: 8 }}>
        <Grid container spacing={2} sx={{ gridAutoFlow: "column" }}>
            <Grid item container spacing={2}>
                <Grid item spacing={2} sm={8} md={8} sx={{
                }}>
                    <Typography variant="h6" sx={{ textAlign: "center" }}>Item</Typography>
                </Grid>
                <Grid item spacing={2} sm={2} md={2} >
                    <Typography variant="h6" sx={{ textAlign: "center" }}>Quantity</Typography>
                </Grid>
                <Grid item spacing={2} sm={2} md={2} >
                    <Typography variant="h6" sx={{ textAlign: "center" }}>Subtotal</Typography>
                </Grid>
            </Grid>
            <Grid item container sm={12} md={12} spacing={2}>
                {cart?.map(({ product, quantity }) => {
                    const { title, id, price, description, rating, image } = product;
                    {/* total = total + quantity * price; */ }
                    return <Grid item key={id} sm={12} md={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={8} md={8} spacing={2} sx={{
                                boxShadow: "none",
                                ".MuiPaper-root": {
                                    boxShadow: "none",

                                }
                            }}>
                                <Card sx={{ display: "flex" }}>
                                    <CardMedia component="img" image={image} sx={{
                                        width: theme.spacing(10),
                                        height: theme.spacing(10),
                                        objectFit: "contain",
                                        pt: theme.spacing(),
                                    }} alt={title} />
                                    <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <Typography>
                                                {title}
                                            </Typography>
                                            <Rating value={rating.rate} size="small" readOnly precision={0.5} emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />

                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item sm={2} md={2} spacing={2} sx={{
                                display: "flex",
                                justifyContent: "center",
                                ".MuiGrid-root": {
                                    justifyContent: "center",
                                }
                            }}>
                                <form>
                                    <TextField value={Number(quantity)}
                                        type="number"
                                        onChange={(e) => updateQuantity(e, { product, quantity })}
                                        inputProps={{ min: 0, max: 10 }}
                                        sx={{
                                            textAlign: "center",
                                            ".MuiInputBase-input": {
                                                textAlign: "center",
                                            },

                                            // border: "none",
                                            // ".MuiOutlinedInput-notchedOutline": {
                                            //     border: "none"
                                            // }

                                        }}>
                                    </TextField>
                                </form>
                            </Grid>
                            <Grid item sm={2} md={2} spacing={2}>
                                <form>
                                    {/* <TextField value={`USD ${Number(quantity * price).toFixed(2)}`} sx={{ */}
                                    <TextField
                                        id={`${id}-product-id`}
                                        value={`USD ${Number(getSubtotal([{ product, quantity }])).toFixed(2)}`} sx={{
                                            textAlign: "center",
                                            ".MuiInputBase-input": {
                                                textAlign: "center",
                                            },
                                            ".MuiOutlinedInput-notchedOutline": {
                                                border: "none",
                                            }
                                        }}>
                                    </TextField>
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                })}
            </Grid>
            <Grid item container spacing={2}>
                <Grid item spacing={2} sm={8} md={8} sx={{
                }}>
                    <Typography sx={{ textAlign: "center" }}>{cart.length ? "" : "No products added."}</Typography>
                </Grid>
                <Grid item spacing={2} sm={2} md={2} >
                    <Typography variant="h6" sx={{ textAlign: "center" }}>Total</Typography>
                </Grid>
                <Grid item spacing={2} sm={2} md={2} >
                    <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>USD {Number(total).toFixed(2)}</Typography>
                </Grid>
            </Grid>
            <Grid item container spacing={2}>
                <Grid item spacing={2} sm={8} md={8} sx={{
                }}>
                    <Typography sx={{ textAlign: "center", display: "none" }}></Typography>
                </Grid>
                <Grid item spacing={2} sm={2} md={2} >
                    <Typography variant="h6" sx={{ textAlign: "center", display: "none" }}></Typography>
                </Grid>
                <Grid item spacing={2} sm={2} md={2} sx={{ justifyContent: "center", display: "flex" }}>
                    {total > 0 ? <Button sx={{ color: "white", background: "green" }} onClick={checkOutItems}>Buy Now</Button> : <Button sx={{ color: "white", background: "green" }} onClick={goToHome}>Shop Now</Button>}
                </Grid>
            </Grid>
        </Grid>
    </Container>
}
