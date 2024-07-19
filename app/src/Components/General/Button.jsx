import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

const Button = ({className, ...props}) => {
  return <button {...props} className={twMerge('px-2 py-1 rounded', className)} />
}

export default Button;