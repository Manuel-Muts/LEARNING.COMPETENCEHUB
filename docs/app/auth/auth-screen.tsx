"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import ButtonSpinner from "@/components/button-spinner";
import {
  authApiRequest,
  setCachedAccount,
  type AuthenticatedAccount,
} from "@/lib/auth-api";
import { formatKenyanPhoneInput, normalizeKenyanPhoneNumber } from "@/lib/phone";

type AuthMode = "login" | "signup" | "reset";

export default function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const isReset = mode === "reset";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resetPhone, setResetPhone] = useState("");
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const formData = new FormData(event.currentTarget);

    setMessage("");
    if (isReset && resetStep === 2) {
      const verificationCode = String(formData.get("verificationCode") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");

      if (!/^\d{6}$/.test(verificationCode)) {
        setMessage("Enter the 6-digit verification code.");
        return;
      }
      if (password.length < 8) {
        setMessage("Your new password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("The passwords do not match. Please check and try again.");
        return;
      }

      setIsSubmitting(true);
      try {
        await authApiRequest("password-reset/confirm", {
          method: "POST",
          body: {
            phone: resetPhone,
            code: verificationCode,
            new_password: password,
          },
        });
        router.replace("/login");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Password reset failed.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const normalizedPhone = normalizeKenyanPhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      setMessage("Enter a valid Kenyan mobile number, such as 712 345 678.");
      return;
    }

    if (isReset) {
      setIsSubmitting(true);
      try {
        await authApiRequest("password-reset/request", {
          method: "POST",
          body: { phone: normalizedPhone },
        });
        setResetPhone(normalizedPhone);
        setResetStep(2);
        setMessage("");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not request a reset code.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignup) {
        const account = await authApiRequest<AuthenticatedAccount>("signup", {
          method: "POST",
          body: {
            learner_name: String(formData.get("name") ?? "").trim(),
            guardian_phone: normalizedPhone,
            password: String(formData.get("password") ?? ""),
            email: String(formData.get("email") ?? "").trim() || null,
          },
        });
        setCachedAccount(account);
      } else {
        const account = await authApiRequest<AuthenticatedAccount>("login", {
          method: "POST",
          body: {
            phone: normalizedPhone,
            password: String(formData.get("password") ?? ""),
          },
        });
        setCachedAccount(account);
      }
      router.replace(isSignup ? "/?accountCreated=1" : "/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to access your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Learning illustration">
        <Link className="auth-brand" href="/" aria-label="CompetenceHub home">
          <span className="brand-mark">c</span>
          <span><strong>competence</strong><span>HUB</span></span>
        </Link>

        <div className="auth-visual-content">
          <div className="learning-art" aria-hidden="true">
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            <span className="art-spark art-spark-one">✦</span>
            <span className="art-spark art-spark-two">✳</span>
            <div className="art-book art-book-back" />
            <div className="art-book art-book-front">
              <span />
              <span />
              <span />
            </div>
            <div className="art-pencil"><span /></div>
            <div className="art-plant"><span /><i /><i /><i /></div>
            <div className="art-ground" />
          </div>
          <span className="auth-kicker">A BRIGHTER WAY TO LEARN</span>
          <h1>
            {isSignup
              ? "Every great journey starts with a first step."
              : isReset
                ? "Let’s get you back to learning."
                : "Good to see you again."}
          </h1>
          <p>
            {isSignup
              ? "Create your learner account and make space for new ideas, practice, and progress."
              : isReset
                ? "Verify your account and choose a new password to continue your learning journey."
                : "Pick up where you left off and keep growing, one lesson at a time."}
          </p>
          <div className="auth-visual-footer">
            <span className="auth-avatar-stack" aria-hidden="true"><i>L</i><i>✦</i><i>+</i></span>
            <span>Curiosity looks good on you.</span>
          </div>
        </div>
        <span className="auth-visual-decoration" aria-hidden="true">LEARN · GROW · SHINE</span>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Link className="auth-mobile-brand" href="/" aria-label="CompetenceHub home">
            <span className="brand-mark">c</span>
            <span><strong>competence</strong><span>HUB</span></span>
          </Link>
          <div className="auth-form-heading">
            <span className="auth-form-kicker">
              {isSignup ? "START YOUR JOURNEY" : isReset ? "ACCOUNT RECOVERY" : "WELCOME BACK"}
            </span>
            <h2>
              {isSignup
                ? "Create your account"
                : isReset
                  ? resetStep === 1 ? "Reset your password" : "Verify and set a new password"
                  : "Sign in to your account"}
            </h2>
            <p>
              {isSignup
                ? "Your learning space is just a few details away."
                : isReset
                  ? resetStep === 1
                    ? "Enter the contact number linked to your learner account."
                    : "Enter the SMS code and choose a new password."
                  : "Enter your details to continue to your learning space."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="auth-field">
                <span>Learner name</span>
                <input
                  autoComplete="name"
                  name="name"
                  placeholder="Enter learner name"
                  required
                />
              </label>
            )}
            {(!isReset || resetStep === 1) && (
              <label className="auth-field">
                <span>
                  {isSignup ? "Parent or guardian contact number" : "Contact number"}
                </span>
                <span className="auth-phone-wrap">
                  <span className="auth-phone-prefix" aria-hidden="true">+254</span>
                  <input
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={12}
                    name="phone"
                    onChange={(event) => {
                      setPhoneNumber(formatKenyanPhoneInput(event.target.value));
                      setMessage("");
                    }}
                    placeholder="712 345 678"
                    required
                    type="tel"
                    value={phoneNumber}
                  />
                </span>
                {(isSignup || isReset) && (
                  <span className="auth-field-hint">
                    {isReset
                      ? "We’ll use this number for account verification when SMS is connected."
                      : "Enter the 9 digits after +254. This number can receive account messages by SMS."}
                  </span>
                )}
              </label>
            )}
            {isSignup && (
              <label className="auth-field">
                <span>Email address <small>(optional)</small></span>
                <input
                  autoComplete="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                />
              </label>
            )}
            {isReset && resetStep === 2 && (
              <>
                <div className="auth-reset-destination">
                  <span>Reset request for</span>
                  <strong>{resetPhone}</strong>
                  <p>If an account is registered for this number, a reset code has been sent.</p>
                </div>
                <label className="auth-field">
                  <span>6-digit verification code</span>
                  <input
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    name="verificationCode"
                    onChange={() => setMessage("")}
                    placeholder="Enter verification code"
                    required
                    type="text"
                  />
                </label>
                <label className="auth-field">
                  <span>New password</span>
                  <span className="auth-password-wrap">
                    <input
                      autoComplete="new-password"
                      minLength={8}
                      name="password"
                      onChange={() => setMessage("")}
                      placeholder="At least 8 characters"
                      required
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </span>
                </label>
                <label className="auth-field">
                  <span>Confirm new password</span>
                  <span className="auth-password-wrap">
                    <input
                      autoComplete="new-password"
                      minLength={8}
                      name="confirmPassword"
                      onChange={() => setMessage("")}
                      placeholder="Enter the new password again"
                      required
                      type={showConfirmPassword ? "text" : "password"}
                    />
                    <button
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      type="button"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </span>
                </label>
              </>
            )}
            {!isReset && (
              <label className="auth-field">
                <span>Password</span>
                <span className="auth-password-wrap">
                  <input
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    minLength={8}
                    name="password"
                    placeholder={isSignup ? "At least 8 characters" : "Enter your password"}
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </span>
              </label>
            )}

            {isReset ? null : isSignup ? (
              <label className="auth-terms">
                <input required type="checkbox" />
                <span>I agree to use this learning space respectfully.</span>
              </label>
            ) : (
              <div className="auth-form-options">
                <label className="auth-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link className="auth-inline-button" href="/forgot-password">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              aria-busy={isSubmitting}
              className="auth-submit button button-primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && <ButtonSpinner />}
              {isSignup
                ? isSubmitting ? "Creating account…" : "Create learner account"
                : isReset
                  ? isSubmitting ? "Please wait…" : resetStep === 1 ? "Continue" : "Reset password"
                  : isSubmitting ? "Signing in…" : "Sign in"}
              <span aria-hidden="true">→</span>
            </button>
            {message && <p className="auth-status" role="status">{message}</p>}
          </form>

          {!isReset && (
            <p className="auth-switch">
              {isSignup ? "Already have an account?" : "New to CompetenceHub?"}{" "}
              <Link href={isSignup ? "/login" : "/signup"}>
                {isSignup ? "Sign in" : "Create an account"}
              </Link>
            </p>
          )}
          <p className="auth-back-link">
            {isReset && resetStep === 2 ? (
              <button
                className="auth-inline-button"
                onClick={() => {
                  setResetStep(1);
                  setMessage("");
                }}
                type="button"
              >
                ← Change contact number
              </button>
            ) : (
              <Link href={isReset ? "/login" : "/"}>← {isReset ? "Back to sign in" : "Back to learning space"}</Link>
            )}
          </p>
          <p className="auth-backend-note">
            {isReset
              ? "Password recovery will be available once the TalkSasa API request details are configured."
              : "Your account is secured by the authentication service. Never share your password or verification codes."}
          </p>
        </div>
      </section>
    </main>
  );
}
