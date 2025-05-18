export const checkUserExist = (user: any) => {
  if (user) {
    const error: any = new Error("This phone number has already been register");
    error.status = 400;
    error.code = "Erro_Auth";
    throw error;
  }
};

export const checkOtpErrorItSameDate = (
  isSameDte: boolean,
  errorCount: number,
  count: number
) => {
  if (isSameDte && errorCount === 5) {
    const error: any = new Error(
      "Otp was wrong for 5 times. Please try again tomorrow."
    );
    error.status = 401;
    error.code = "Error_OverLimit";
    throw error;
  } else if (isSameDte && count) {
    const error: any = new Error(
      "Otp is reach limit. Please try again tomorrow."
    );
    error.status = 401;
    error.code = "Error_OverLimit";
    throw error;
  }
};

export const checkOtpRow = (otpRow: any) => {
  if (!otpRow) {
    const error: any = new Error("Phon number is incorrect.");
    error.status = 400;
    error.code = "Error_InvalidPhone";
    throw error;
  }
};
