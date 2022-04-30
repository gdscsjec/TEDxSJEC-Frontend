import axios from "axios";
import { useContext, useRef } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import loadingContext from "../context/loadingContext";

// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#12-integrate-with-checkout-on-client-side

//https://razorpay.com/docs/payments/payment-gateway/rainy-day/capture-settings/api/#:~:text=Once%20your%20customer%20completes%20a,status%20from%20the%20bank%20immediately.

const Form = () => {
  const a = useContext(loadingContext);

  const fileButton = useRef(null);

  const navigate = useNavigate();

  const callSetLoading = () => {
    a.setLoading(true);
  };

  const stopLoading = () => {
    a.setLoading(false);
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [otpHashData, setOtpHashData] = useState();

  const [status, setStatus] = useState(false);

  const [otp, setOtp] = useState();

  const [image, setImage] = useState("");
  // ImgUrl is used to get ObjectURL of the image
  const [imageUrl, setImageUrl] = useState("/static/default_image.png");

  const OnChangeValue = (e) => {
    const { value, name } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const OnSubmit = async (e) => {
    callSetLoading();
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("email", form.email);
    formdata.append("phone", `+91${form.phone}`);
    formdata.append("otp", otp);
    formdata.append("hash", otpHashData.hash);
    const request = await axios.post(
      "https://ted.vigneshcodes.in/api/verify-otp",
      formdata
    );
    if (request.status === 200) {
      toast.success("OTP Verified Successfully!!");
      const { id, amount, currency } = request.data.payment.orderId;
      console.log(request.data.payment.orderId);
      await OnSubmitOrder(id, amount, currency);
    } else if (request.status === 400) {
      stopLoading();
      toast.error("OTP Verification Failed!!");
    } else {
      stopLoading();
      toast.error("Something Went Wrong!!");
    }
  };

  const OnSubmitOrder = async (id, amount, currency) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      toast.error("Something went wrong!!");
      stopLoading();
    };
    script.onload = async () => {
      try {
        const options = {
          key: "rzp_test_6nDlvCH0abXQJN",
          amount: amount,
          currency: currency,
          name: "St Joseph Engineering College",
          description: "TEDxSJEC 2022",
          image: "https://sjec.ac.in/images/sjec-logo.png",
          order_id: id,
          modal: {
            ondismiss: function() {
              stopLoading();
              toast.error("Payment cancelled!");
            }
          },
          handler: async function (response) {
            let formdata = new FormData();
            formdata.append("name", form.name);
            formdata.append("email", form.email);
            formdata.append("phone", `+91${form.phone}`);
            formdata.append("avatar", image);
            formdata.append("razorpay_order_id", response.razorpay_order_id);
            formdata.append(
              "razorpay_payment_id",
              response.razorpay_payment_id
            );
            formdata.append("razorpay_signature", response.razorpay_signature);
            const request = await axios.post(
              "https://ted.vigneshcodes.in/api/payment-success",
              formdata
            );

            if (request.status === 200) {
              stopLoading();
              toast.success("Payment Successful!!");
              navigate(`/ticket/${response.razorpay_order_id}`);
            } else {
              stopLoading();
              toast.error("Something went wrong!!");
            }
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
        toast.error("Something went wrong!!");
      }
    };
    document.body.appendChild(script);
  };

  const onClickOtp = async (e) => {
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
        setStatus(true);
        callSetLoading();
        let formdata = new FormData();
        formdata.append("email", form.email);
        formdata.append("phone", `+91${form.phone}`);
        const request = await axios.post(
          "https://ted.vigneshcodes.in/api/send-otp",
          formdata
        );
        if (request.status === 200) {
          stopLoading();
          toast.success("OTP sent successfully!!");
          setOtpHashData(request.data);
        } else {
          stopLoading();
          toast.error("Something went wrong!!");
        }
      }
    }
  };

  const saveImage = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
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
            />
            <input
              disabled={status}
              style={{ display: "none" }}
              onChange={saveImage}
              required="true"
              accept="image/png, image/jpeg, image/jpg"
              className="form-control"
              type="file"
              id="formFile"
              ref={fileButton}
            />
            <input
              type="button"
              className="btn btn-tedx mt-2"
              onClick={() => fileButton.current.click()}
              value="Upload Image"
            />
          </div>
        </div>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Name
          </label>
          <input
            disabled={status}
            required
            value={form.name}
            onChange={OnChangeValue}
            name="name"
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            disabled={status}
            value={form.email}
            onChange={OnChangeValue}
            name="email"
            required
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Phone Number
          </label>
          <input
            disabled={status}
            value={form.phone}
            onChange={OnChangeValue}
            name="phone"
            required
            maxLength={10}
            type="tel"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>

        <div className="row">
          <div className="col">
            <button
              disabled={status}
              type="action"
              onClick={onClickOtp}
              className="btn btn-tedx"
            >
              Send OTP
            </button>
          </div>
          <div className="col">
            <input
              disabled={!status}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              name="otp"
              required
              maxLength={6}
              placeholder="Enter OTP"
              type="number"
              className="form-control"
            />
          </div>
        </div>

        <button
          disabled={!status}
          style={{
            width: "100%",
          }}
          type="submit"
          className=" btn btn-tedx btn btn-block mt-3"
        >
          Submit
        </button>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default Form;
