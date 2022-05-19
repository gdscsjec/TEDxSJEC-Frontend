import axios from "axios";
import { useContext, useRef } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import loadingContext from "../context/loadingContext";
import { useQuery } from "react-query";

const Form = () => {
  const navigate = useNavigate();
  const { setLoading } = useContext(loadingContext);

  const fileButton = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const onChangeValue = (e) => {
    const { value, name } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const [otp, setOtp] = useState("");
  const [otpHashData, setOtpHashData] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  const [image, setImage] = useState("");
  // ImgUrl is used to get ObjectURL of the image
  const [imageUrl, setImageUrl] = useState("/static/default_user.svg");
  const [response, setResponse] = useState({});

  // Query for OTP Sending
  const sendOtpCallback = () => {
    let formdata = new FormData();
    formdata.append("email", form.email);
    formdata.append("phone", `+91${form.phone}`);
    return axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/send-otp`,
      formdata
    );
  };

  const { refetch: fetchOtp } = useQuery("send-otp", sendOtpCallback, {
    enabled: false,
    onSuccess: (data) => {
      toast.success("OTP sent successfully");
      setOtpHashData(data.data);
    },
    onError: (error) => {
      const { message } = JSON.parse(error.request.response);
      if (message) toast.error(message);
      // Uncaught cases
      else toast.error("Something went wrong");
    },
    onSettled: () => {
      stopLoading();
    },
  });

  const onClickOtp = (e) => {
    e.preventDefault();
    switch (true) {
      case form.name === "":
        toast.error("Please enter your name");
        break;
      case validator.isEmail(form.email) === false:
        toast.error("Please enter valid email");
        break;
      case validator.isMobilePhone(form.phone, "en-IN") === false:
        toast.error("Please enter valid phone number");
        break;
      case !image:
        toast.error("Please upload your image");
        break;
      default: {
        setIsDisabled(true);
        startLoading();
        fetchOtp();
      }
    }
  };

  // Query for OTP Verification
  const verifyOtpCallback = () => {
    let formdata = new FormData();
    formdata.append("email", form.email);
    formdata.append("phone", `+91${form.phone}`);
    formdata.append("otp", otp);
    formdata.append("hash", otpHashData.hash);
    return axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/verify-otp`,
      formdata
    );
  };

  const { refetch: fetchVerifyOtp } = useQuery(
    "verify-otp",
    verifyOtpCallback,
    {
      enabled: false,
      onSuccess: (data) => {
        toast.success("OTP verified successfully");
        const { id, amount, currency } = data.data.payment.orderId;
        OnSubmitOrder(id, amount, currency);
      },
      onError: (error) => {
        stopLoading();
        const { message } = JSON.parse(error.request.response);
        if (message) toast.error(message);
        // Uncaught cases
        else toast.error("Something went wrong");
      },
    }
  );

  const OnSubmit = (e) => {
    startLoading();
    e.preventDefault();
    fetchVerifyOtp();
  };

  // Query for payment confirmation
  const paymentConfirmationCallback = () => {
    let formdata = new FormData();
    formdata.append("name", form.name);
    formdata.append("email", form.email);
    formdata.append("phone", `+91${form.phone}`);
    formdata.append("avatar", image);
    formdata.append("razorpay_order_id", response.razorpay_order_id);
    formdata.append("razorpay_payment_id", response.razorpay_payment_id);
    formdata.append("razorpay_signature", response.razorpay_signature);
    return axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/payment-success`,
      formdata
    );
  };

  const { refetch: fetchPaymentConfirm } = useQuery(
    "payment-success",
    paymentConfirmationCallback,
    {
      enabled: false,
      onSuccess: () => {
        stopLoading();
        toast.success("Payment successful");
        navigate(`/ticket/${response.razorpay_order_id}`);
      },
      onError: (error) => {
        stopLoading();
        const { message } = JSON.parse(error.request.response);
        if (message) toast.error(message);
        // Uncaught cases
        else toast.error("Something went wrong");
      },
    }
  );

  const OnSubmitOrder = (id, amount, currency) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      toast.error("Something went wrong");
      stopLoading();
    };
    script.onload = () => {
      try {
        const options = {
          key: process.env.REACT_APP_RZR_KEY,
          amount: amount,
          currency: currency,
          name: "St Joseph Engineering College",
          description: "TEDxSJEC 2022",
          image: "https://sjec.ac.in/images/sjec-logo.png",
          order_id: id,
          modal: {
            ondismiss: function () {
              stopLoading();
              toast.error("Payment cancelled");
            },
          },
          handler: function (response) {
            setResponse(response);
            setTimeout(() => {
              fetchPaymentConfirm();
            }, 1000);
          },
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          notes: {
            address: "TEDxSJEC 2022",
          },
          theme: {
            color: "#ff2a05",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        stopLoading();
        toast.error("Something went wrong");
      }
    };
    document.body.appendChild(script);
  };

  // Utility function to save images (Downloading ticket)
  const saveImage = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    // Lower limit = 5 KB = 5120 Bytes
    if (e.target.files[0].size < 5120)
      return toast.error("Image size must be greater than 5KB");
    // Upper limit = 1 MB = 1048576 Bytes
    if (e.target.files[0].size > 1048576)
      return toast.error("Image size must be less than 1MB");
    setTimeout(() => {
      setImage(e.target.files[0]);
      setImageUrl(img);
    }, 100);
  };

  return (
    <>
      <form onSubmit={OnSubmit}>
        <div className="mb-3">
          <div className="avatar-container">
            <img
              className="avatar"
              alt="avatar"
              id="avatarImage"
              src={imageUrl}
              draggable="false"
              width="200"
              height="200"
              onClick={() => fileButton.current.click()}
            />
            <input
              disabled={isDisabled}
              style={{ display: "none" }}
              onChange={saveImage}
              required={true}
              accept="image/png, image/jpeg, image/jpg"
              className="form-control"
              type="file"
              id="formFile"
              ref={fileButton}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Name
          </label>
          <input
            disabled={isDisabled}
            required={true}
            value={form.name}
            onChange={onChangeValue}
            name="name"
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            disabled={isDisabled}
            value={form.email}
            onChange={onChangeValue}
            name="email"
            required={true}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter your email address"
          />
          <div id="emailHelp" class="form-text">
            Faculty &amp; Students of SJEC use official email addresses.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Phone Number
          </label>
          <input
            disabled={isDisabled}
            value={form.phone}
            onChange={onChangeValue}
            name="phone"
            required={true}
            maxLength={10}
            type="tel"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="row">
          <div className="col">
            <button
              disabled={isDisabled}
              type="action"
              onClick={onClickOtp}
              className="btn btn-tedx"
            >
              Send OTP
            </button>
          </div>
          <div className="col">
            <input
              disabled={!isDisabled}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              name="otp"
              required={true}
              maxLength={6}
              placeholder="Enter OTP"
              type="number"
              className="form-control"
            />
          </div>
        </div>

        <button
          disabled={!isDisabled}
          style={{
            width: "100%",
          }}
          type="submit"
          className=" btn btn-tedx btn btn-block mt-3"
        >
          Pay Now
        </button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default Form;
