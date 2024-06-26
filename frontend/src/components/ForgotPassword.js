import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Icon from "assets/Icons";
import { connect } from "react-redux";
import { forgotPassword } from "store/modules/usersAuth/userAuth.action";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Required"),
});

const ForgotPassword = (props) => {
  const { forgotPassword } = props;

  const navigate = useNavigate();
  const { email } = useParams();

  const initialValues = {
    email: email || "",
    redirectUrl: "http://localhost:3000/reset/password",
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        forgotPassword(values)
          .then((res) => {
            if (res.status === "PENDING") {
              navigate(`/email/reset/${values?.email}`);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        setSubmitting(false);
      }}
    >
      {(formikOptions) => {
        const { isSubmitting, errors, touched, dirty, isValid } = formikOptions;
        return (
          <>
            <div className="section">
              <div className="flex h-screen justify-center">
                <div className="text-center py-5">
                  <div className="pb-5 pt-5 pt-sm-2 text-center">
                    <Form className="card-3d-wrap mx-auto">
                      <div className={`card-3d-wrapper `}>
                        <div className="card-front">
                          <div className="center-wrap">
                            <div className="section text-center">
                              <h4 className="text-white font-bold text-2xl mb-4 pb-3">
                                Password Reset
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
                              <button
                                type="submit"
                                className="btn mt-4"
                                disabled={!dirty || !isValid || isSubmitting}
                              >
                                {isSubmitting && <Icon.Loader />}
                                Reset
                              </button>

                              <p className="mb-0 text-white font-medium text-sm mt-11 text-center">
                                Go to
                                <Link
                                  to="/login"
                                  className="link ml-1 text-[#8ed1fc]"
                                >
                                  Login | Signup
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                  <div className="text-white">
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
    forgotPassword: (data) => dispatch(forgotPassword(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
