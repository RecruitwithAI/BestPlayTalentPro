import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  to?: string;
  className?: string;
}

const LABEL = "Sign-up / Login";

const SignupLoginButton: React.FC<Props> = ({ to = "/register", className = "" }) => {
  return (
    <Link to={to} aria-label={LABEL}>
      <Button
        variant="signup"
        className={`px-0 py-0 h-auto text-2xl md:text-3xl bg-transparent ${className}`}
      >
        {LABEL.split("").map((ch, i) => (
          <span
            key={i}
            className="signup-letter"
            style={{ animationDelay: `${i * 0.12}s` }}
            aria-hidden="true"
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
        <span className="sr-only">{LABEL}</span>
      </Button>
    </Link>
  );
};

export default SignupLoginButton;
