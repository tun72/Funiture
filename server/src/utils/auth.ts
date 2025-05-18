export const checkUserExist = (user: any) => {
    if(user) {
        const error:any = new Error("This phone number has already been register");
        error.status = 400;
        error.code = "Erro_Auth"
        throw error
    }
}