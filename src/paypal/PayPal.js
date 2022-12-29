import React, { useRef, useEffect } from 'react';

export default function Paypal({ gia, note }) {
    const paypal = useRef();

    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [
                            {
                                description: note,
                                amount: {
                                    currency_code: 'USD',
                                    value: gia / 24000
                                }
                            }
                        ]
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order);
                },
                onError: (err) => {
                    console.log(err);
                }
            })
            .render(paypal.current);
    }, []);

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    );
}
