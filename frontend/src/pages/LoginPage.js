import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Icon from "assets/Icons";
import { connect } from "react-redux";
import { login, register } from "store/modules/usersAuth/userAuth.action";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { sessionService } from "redux-react-session";

const validationSchema = Yup.object({
  name: Yup.string().when("signup", {
    is: true,
    then: () => Yup.string().required("Required"),
    otherwise: () => Yup.string(),
  }),
  dob: Yup.string().when("signup", {
    is: true,
    then: () =>
      Yup.string()
        .required("Required")
        .test(
          "is-15-years-old",
          "You must be at least 15 years old",
          (value) => moment().diff(moment(value), "years") >= 15
        )
        .test(
          "is-dead",
          "You have entered wrong date of birth",
          (value) => moment().diff(moment(value), "years") <= 150
        ),
    otherwise: () => Yup.string(),
  }),
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters long")
    .matches(/^(?=.*[A-Z]).+$/, "Must contain at least one uppercase letter")
    .matches(/^(?=.*[a-z]).+$/, "Must contain at least one lowercase letter")
    .matches(/^(?=.*\d).+$/, "Must contain at least one digit")
    .matches(
      /^(?=.*[@$!%*?&]).+$/,
      "Must contain at least one special character"
    )
    .required("Required"),
});

const LoginSignup = (props) => {
  const { signin, signup } = props;
  const formRef = useRef({});

  const navigate = useNavigate();
  const { email } = useParams();

  const initialValues = {
    name: "",
    dob: "",
    email: email || "",
    password: "",
    signup: false,
  };

  const formatDate = (value) => {
    // Remove all non-digit characters
    let formattedValue = value.replace(/\D/g, "");

    // Insert dashes at the correct positions
    if (formattedValue.length >= 3 && formattedValue.length <= 4) {
      formattedValue =
        formattedValue.substring(0, 2) + "-" + formattedValue.substring(2);
    } else if (formattedValue.length >= 5) {
      formattedValue =
        formattedValue.substring(0, 2) +
        "-" +
        formattedValue.substring(2, 4) +
        "-" +
        formattedValue.substring(4, 8);
    }

    return formattedValue;
  };

  const toggleForm = (event) => {
    formRef.current.resetForm();
    formRef.current.setFieldValue("signup", event.target.checked);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        let payload = {
          email: values?.email,
          password: values?.password,
        };
        if (!values?.signup) {
          signin(payload)
            .then((res) => {
              if (res.status === "SUCCESS") {
                const userData = res?.data;
                const token = res?.data?._id;
                sessionService
                  .saveSession(token)
                  .then(() => {
                    sessionService.saveUser(userData).then(() => {
                      navigate("/");
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
              setSubmitting(false);
            })
            .catch((err) => {
              console.log(err);
              setSubmitting(false);
            });
        } else {
          payload.name = values?.name;
          payload.dob = moment(values?.dob).format("DD-MM-YYYY");

          signup(payload)
            .then((res) => {
              const { email } = payload;
              if (res.status === "PENDING") {
                // display message for email verification
                navigate(`/email/verification/${email}`);
              }
              setSubmitting(false);
            })
            .catch((err) => {
              console.log(err);
              setSubmitting(false);
            });
        }
      }}
    >
      {(formikOptions) => {
        const {
          isSubmitting,
          errors,
          touched,
          values,
          dirty,
          isValid,
          setFieldValue,
        } = formikOptions;
        formRef.current = formikOptions;
        return (
          <>
            <div className="section">
              <div className="flex h-screen justify-center">
                <div className="text-center py-5">
                  <div className="pb-5 pt-5 pt-sm-2 text-center">
                    <h6 className="text-[#8367c7] mb-0 pb-3">
                      <span>Log In </span>
                      <span>Sign Up</span>
                    </h6>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-gray-200 py-1 px-4">
                        <input
                          className="checkbox"
                          type="checkbox"
                          id="toggle"
                          defaultChecked={values?.signup}
                          name="toggle"
                        />
                        <label
                          htmlFor="toggle"
                          onClick={() =>
                            toggleForm({ target: { checked: !values?.signup } })
                          }
                        ></label>
                      </div>
                    </div>
                    <Form className="card-3d-wrap mx-auto">
                      <div
                        className={`card-3d-wrapper ${
                          values?.signup ? "rotateY-180" : ""
                        }`}
                      >
                        <div className="card-front">
                          <div className="center-wrap">
                            <div className="section text-center">
                              <h4 className="text-white font-bold text-2xl mb-4 pb-3">
                                Log In
                              </h4>
                              <div className="form-group">
                                <Field
                                  type="email"
                                  name="email"
                                  className={`form-style ${
                                    errors.email && touched.email ? "error" : ""
                                  }`}
                                  placeholder="Email"
                                />
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  type="password"
                                  name="password"
                                  className={`form-style ${
                                    errors.password && touched.password
                                      ? "error"
                                      : ""
                                  }`}
                                  placeholder="Password"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn mt-4"
                                disabled={!dirty || !isValid || isSubmitting}
                              >
                                {isSubmitting && <Icon.Loader />}
                                Login
                              </button>

                              <p className="mb-0 text-white font-medium text-sm mt-4 text-center">
                                <Link to="/forgot/password" className="link">
                                  Forgot your password ?
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="card-back">
                          <div className="center-wrap">
                            <div className="section text-center">
                              <h4 className="text-white font-bold text-2xl mb-3 pb-3">
                                Sign Up
                              </h4>
                              <div className="form-group">
                                <Field
                                  type="text"
                                  name="name"
                                  className={`form-style ${
                                    errors.name && touched.name ? "error" : ""
                                  }`}
                                  placeholder="Full Name"
                                />
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  name="dob"
                                  type="text"
                                  maxLength="10"
                                  placeholder="DOB (DD-MM-YYYY)"
                                  className={`form-style ${
                                    errors.dob && touched.dob ? "error" : ""
                                  }`}
                                  value={values.dob}
                                  onChange={(e) => {
                                    const formattedDate = formatDate(
                                      e.target.value
                                    );
                                    setFieldValue("dob", formattedDate, true);
                                  }}
                                />
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  type="email"
                                  name="email"
                                  className={`form-style ${
                                    errors.email && touched.email ? "error" : ""
                                  }`}
                                  placeholder="Email"
                                />
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  type="password"
                                  name="password"
                                  className={`form-style ${
                                    errors.password && touched.password
                                      ? "error"
                                      : ""
                                  }`}
                                  placeholder="Password"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn mt-4"
                                disabled={!dirty || !isValid || isSubmitting}
                              >
                                {isSubmitting && <Icon.Loader />}
                                Register
                              </button>
                              <div className="mt-5 text-white font-medium text-sm">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleForm({ target: { checked: false } })
                                  }
                                >
                                  Already have an account ?
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                  <div className="text-white pb-5">
                    <p>
                      All rights reserved.
                      <span className="text-violet-800 mx-2">
                        <a
                          href="https://github.com/sartkthegr8"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Vipin Sharma
                        </a>
                      </span>
                      Copyright &copy;2024.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    signin: (data) => dispatch(login(data)),
    signup: (data) => dispatch(register(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginSignup);
