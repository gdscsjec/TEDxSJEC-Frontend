import { GoogleLogin } from "react-google-login";
import axios from "axios";
import { useState } from "react";

function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const responseGoogle = async (response) => {
    let formData = new FormData();
    formData.append("tokenId", response.tokenId);
    const res = await axios.post("http://localhost:8000/api/auth", formData);
    if (!res.data) {
      console.log("error");
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };
    script.onload = async () => {
      try {
        setLoading(true);
        const { amount, id: order_id, currency } = res.data.order;

        const options = {
          key: "rzp_test_6nDlvCH0abXQJN",
          amount: amount.toString(),
          currency: currency,
          name: res.data.response.name,
          description: "TEDxSJEC 2022",
          order_id: order_id,
          handler: async function (response) {
            const formData = new FormData();
            formData.append(
              "razorpay_payment_id",
              response.razorpay_payment_id
            );
            formData.append("razorpay_order_id", response.razorpay_order_id);
            formData.append("razorpay_signature", response.razorpay_signature);
            formData.append("name", res.data.response.name);
            formData.append("email", res.data.response.email);
            formData.append("razorpay_amount", amount);
            formData.append("image", res.data.response.picture);
            const resFinal = await axios.post(
              "http://localhost:8000/api/payment/post",
              formData
            );
            console.log(resFinal.data);
          },
          prefill: {
            name: res.data.response.name,
            email: res.data.response.email,
          },
          notes: {
            address: "TEDxSJEC 2022",
          },
          theme: {
            color: "#ff2a05",
          },
        };

        setLoading(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  return (
    <>
      <h1>Payment Method</h1>
      <GoogleLogin
        clientId="667445175086-jvcn80fe9ercbl8rr8bsq2vk7lnq1l7c.apps.googleusercontent.com"
        render={(renderProps) => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            Register Now!!
          </button>
        )}
        buttonText="Register"
        onSuccess={responseGoogle}
        onFailure={(response) => {
          console.log(response);
        }}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
}

export default PaymentButton;
