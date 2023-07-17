const SHOW_TIME = 10000;

const toastContainer = document.createElement("div");
toastContainer.classList.add("toast-container");
document.body.append(toastContainer);

const toast = (message) => {
    const toastItem = document.createElement("div");
    toastContainer.style.position = "absolute";
    toastItem.style.backgroundColor = "red";
    toastContainer.style.zIndex = 100;
    
    toastContainer.style.left = 0;
    toastContainer.style.top = 0;
    toastContainer.style.right = 0;
    toastItem.textContent = message;
    toastItem.classList.add("toast-item");

    toastContainer.prepend(toastItem);

    /*setTimeout(() => {
        toastItem.remove();
    }, SHOW_TIME);*/
};

export {toast};