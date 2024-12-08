import { addLike, rmLike, deleteCard } from "./api";

export function renderCard({ cardData, currentUserId, onImageClick }) {
  const templateCard = document.querySelector("#card-template").content;
  const card = templateCard.querySelector(".card").cloneNode(true);
  const img = card.querySelector(".card__image");
  const title = card.querySelector(".card__title");
  const deleteBtn = card.querySelector(".card__delete-button");
  const likeBtn = card.querySelector(".card__like-button");
  const likesCount = card.querySelector(".card__likes-count");

  img.src = cardData.link;
  img.alt = cardData.name;
  title.textContent = cardData.name;
  likesCount.textContent = cardData.likes.length;

  if (cardData.owner._id !== currentUserId) {
    deleteBtn.remove();
  } else {
    deleteBtn.addEventListener("click", () => {
      deleteCard({ id: cardData._id }).then(() => card.remove());
    });
  }

  if (cardData.likes.some(({ _id }) => _id === currentUserId)) {
    likeBtn.classList.add("card__like-button_is-active");
  }

  likeBtn.addEventListener("click", () =>
    (likeBtn.classList.contains("card__like-button_is-active")
      ? rmLike({ cardId: cardData._id }).then((r) => {
          likeBtn.classList.remove("card__like-button_is-active");
          return r;
        })
      : addLike({ cardId: cardData._id }).then((r) => {
          likeBtn.classList.add("card__like-button_is-active");
          return r;
        })
    ).then((updatedCard) => {
      likesCount.textContent = updatedCard.likes.length;
    }),
  );

  img.addEventListener("click", () => onImageClick());

  return card;
}
