"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CircleDashed } from "lucide-react";

import { cn } from "@/app/plataform/lib/utils";

import { Button, type ButtonProps } from "./button";

export type ButtonStateEnum = "loading" | "idle" | "error" | "success";

interface LoadingButtonProps extends ButtonProps {
  state?: ButtonStateEnum;
  errorAutoResetDelay?: number; // in seconds
}

export function LoadingButton(props: LoadingButtonProps) {
  const {
    children,
    state = "idle",
    errorAutoResetDelay,
    className,
    ...rest
  } = props;

  const [_state, _setState] = useState<ButtonStateEnum>(state);
  useEffect(() => {
    _setState(state);
    if (state === "error" && errorAutoResetDelay) {
      const timer = setTimeout(() => {
        _setState("idle");
      }, errorAutoResetDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [state, errorAutoResetDelay]);

  return (
    <Button
      {...rest}
      disabled={_state !== "idle"}
      className={cn(
        className,
        _state == "error" ? "bg-red-500 text-white hover:bg-red-500/90" : "",
      )}
    >
      {_state == "loading" && (
        <CircleDashed className="mr-2 size-4 animate-spin" />
      )}
      {_state == "error" && <AlertTriangle className="mr-2 size-4" />}
      {children}
    </Button>
  );
}
