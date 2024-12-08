export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
}

export function attachPopupListeners(selector, { onSubmit } = {}) {
  const popup = document.querySelector(selector);
  const submitButton = popup.querySelector(".popup__button");
  popup.querySelector(".popup__form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const textBefore = submitButton.textContent;
    submitButton.textContent = "Сохранение...";
    Promise.resolve(onSubmit?.())
      .then(() => {
        close();
      })
      .finally(() => {
        submitButton.textContent = textBefore;
      });
  });

  const open = () => popup.classList.add("popup_is-opened");
  const close = () => closePopup(popup);

  return {
    element: popup,
    inputs: Array.from(popup.querySelectorAll(".popup__input")).reduce(
      (acc, input) => ({
        ...acc,
        [input.name]: input,
      }),
      {},
    ),
    open,
    close,
  };
}

for (const closeBtn of document.querySelectorAll(".popup__close")) {
  closeBtn.addEventListener("click", (event) =>
    closeModal(event.target.closest(".popup")),
  );
}
for (const popup of document.querySelectorAll(".popup")) {
  popup.classList.add("popup_is-animated");
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup(popup);
    }
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup != null) {
      closePopup(openedPopup);
    }
  }
});
