"use client";

import React, { useCallback, useState } from "react";
import { SmartCaptcha, SmartCaptchaProps } from "@yandex/smart-captcha";

interface CaptchaProps {
  onSuccess: (token: string) => void;
}

export const Captcha: React.FC<CaptchaProps> = ({ onSuccess }) => {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("hidden");

  const handleChallengeVisible = useCallback(() => setStatus("visible"), []);
  const handleChallengeHidden = useCallback(() => setStatus("hidden"), []);
  const handleSuccess = useCallback(
    (t: string) => {
      setStatus("success");
      setToken(t);
      onSuccess(t);
    },
    [onSuccess]
  );
  const handleTokenExpired = useCallback(() => {
    setStatus("token-expired");
    setToken("");
    onSuccess("");
  }, [onSuccess]);
  const handleNetworkError: SmartCaptchaProps["onNetworkError"] = useCallback(
    () => setStatus("network-error"),
    []
  );
  const handleJavaScriptError: SmartCaptchaProps["onJavascriptError"] =
    useCallback(() => setStatus("javascript-error"), []);

  const sitekey = process.env.NEXT_PUBLIC_YANDEX_CAPTCHA_SITEKEY || "";

  return (
    <div className="space-y-2">
      <SmartCaptcha
        sitekey={sitekey}
        onChallengeVisible={handleChallengeVisible}
        onChallengeHidden={handleChallengeHidden}
        onNetworkError={handleNetworkError}
        onJavascriptError={handleJavaScriptError}
        onSuccess={handleSuccess}
        onTokenExpired={handleTokenExpired}
      />
    </div>
  );
};
