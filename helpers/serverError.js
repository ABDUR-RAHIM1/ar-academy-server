export const serverError = (res, error) => {
    res.status(500).json({
        message: "Internal server error",
        error: error
    })
}