const followLink: FollowLink = (action) => {
    const a = document.querySelector(action.followLink) as HTMLAnchorElement | null;
    if (a !== null && 'href' in a) {
        location.href = a.href;
        return;
    }
    return {
        message: `Link to follow not found (${action.followLink})`,
    };
};

export default followLink;
