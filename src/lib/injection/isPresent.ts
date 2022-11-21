const isPresent: IsPresent = (action) => {
    const elementIsPresent = document.querySelector(action.isPresent) !== null;
    return elementIsPresent;
};

export default isPresent;
