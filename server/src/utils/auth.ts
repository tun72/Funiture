import { errorCode } from "../../config/errorCode";
export const checkUserExist = (user: any) => {
  if (user) {
    const error: any = new Error("This phone number has already been register");
    error.status = 400;
    error.code = "Erro_Auth";
    throw error;
  }
};

export const checkOtpErrorItSameDate = (
  isSameDate: boolean,
  errorCount: number,
  count: number
) => {
  if (isSameDate && errorCount === 5) {
    const error: any = new Error(
      "Otp was wrong for 5 times. Please try again tomorrow."
    );
    error.status = 401;
    error.code = errorCode.overLimit;
    throw error;
  } else if (isSameDate && count === 3) {
    const error: any = new Error(
      "Otp is reach limit. Please try again tomorrow."
    );
    error.status = 401;
    error.code = errorCode.overLimit;
    throw error;
  }
};

export const checkOtpRow = (otpRow: any) => {
  if (!otpRow) {
    const error: any = new Error("Phone number is incorrect.");
    error.status = 400;
    error.code = errorCode.invalid;
    throw error;
  }
};

export const checkUserIfNotExist = (user: any) => {
  if (!user) {
    const error: any = new Error("This account is not registered.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    throw error;
  }
};
