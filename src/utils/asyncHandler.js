const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        if (!error.code || isNaN(error.code)) {
            error.code = 500; 
        }
        next(error); 
    }
};

export { asyncHandler };
