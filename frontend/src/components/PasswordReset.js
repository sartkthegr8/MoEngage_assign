import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Icon from "assets/Icons";
import { connect } from "react-redux";
import { resetPassword } from "store/modules/usersAuth/userAuth.action";
import { useNavigate, useParams } from "react-router-dom";

const passwordValidation = Yup.string()
  .min(8, "Must be at least 8 characters long")
  .matches(/^(?=.*[A-Z]).+$/, "Must contain at least one uppercase letter")
  .matches(/^(?=.*[a-z]).+$/, "Must contain at least one lowercase letter")
  .matches(/^(?=.*\d).+$/, "Must contain at least one digit")
  .matches(
    /^(?=.*[@$!%*?&]).+$/,
    "Must contain at least one special character"
  );

const validationSchema = Yup.object({
  newPassword: passwordValidation.required("Required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Password not matched")
    .required("Required"),
});

const PasswordReset = (props) => {
  const { resetPassword } = props;

  const navigate = useNavigate();
  const { userId, resetId } = useParams();

  const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
    userId,
    resetId,
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        resetPassword(values)
          .then((res) => {
            if (res.status === "SUCCESS") {
              navigate(`/email`);
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

                              <div className="form-group mt-2">
                                <Field
                                  type="password"
                                  name="newPassword"
                                  className={`form-style ${
                                    errors.newPassword && touched.newPassword
                                      ? "error"
                                      : ""
                                  }`}
                                  placeholder="New Password"
                                />
                              </div>
                              <div className="form-group mt-2">
                                <Field
                                  type="password"
                                  name="confirmNewPassword"
                                  className={`form-style ${
                                    errors.confirmNewPassword &&
                                    touched.confirmNewPassword
                                      ? "error"
                                      : ""
                                  }`}
                                  placeholder="Confirm New Password"
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
                                  to="/forgot-password"
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
    resetPassword: (data) => dispatch(resetPassword(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PasswordReset);
