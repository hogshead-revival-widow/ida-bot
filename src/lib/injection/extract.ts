const extractId: ExtractId = (action) => {
    const extractFrom = document.querySelector(action.extractId) as HTMLElement | null;
    if (extractFrom === null) return { resultId: null };
    const id = extractFrom.getAttribute('id');
    return { resultId: id };
};

export default extractId;
