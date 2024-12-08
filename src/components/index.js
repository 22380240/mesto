import {
  createCard,
  getCardsList,
  getCurrentUser,
  updateCurrentUser,
  updateCurrentUserAvatar,
} from "./api";
import { renderCard as _renderCard } from "./card";
import "../pages/index.css";
import { closePopup, attachPopupListeners } from "./popup";

let currentUser;
function renderCard(cardData) {
  return _renderCard({
    cardData,
    currentUserId: currentUser?._id ?? "",
    onImageClick: () => openImagePopup(cardData),
  });
}
function setCurrentUser(userData) {
  currentUser = userData;
  document.querySelector(".profile__title").textContent = userData.name;
  document.querySelector(".profile__description").textContent = userData.about;
  document.querySelector(".profile__image").style.backgroundImage =
    `url(${userData.avatar})`;
}

/////

const profilePopup = attachPopupListeners(".popup_type_edit", {
  onSubmit: () =>
    updateCurrentUser({
      name: profilePopup.inputs.name.value,
      about: profilePopup.inputs.description.value,
    }).then(setCurrentUser),
});
document
  .querySelector(".profile__edit-button")
  .addEventListener("click", () => {
    profilePopup.inputs.name.value = currentUser?.name;
    profilePopup.inputs.description.value = currentUser?.about;
    profilePopup.open();
  });

/////

const editAvatarPopup = attachPopupListeners(".popup_type_edit-avatar", {
  onSubmit: () =>
    updateCurrentUserAvatar({
      avatar: editAvatarPopup.inputs.link.value.value,
    }).then(setCurrentUser),
});
document.querySelector(".profile__image").addEventListener("click", () => {
  editAvatarPopup.inputs.link.value = currentUser?.avatar;
  editAvatarPopup.open();
});

/////

const newCardPopup = attachPopupListeners(".popup_type_new-card", {
  onSubmit: () =>
    createCard({
      name: newCardPopup.inputs["place-name"].value,
      link: newCardPopup.inputs.link.value,
    }).then((newCardData) => cardsContainer.prepend(renderCard(newCardData))),
});
document.querySelector(".profile__add-button").addEventListener("click", () => {
  newCardPopup.inputs["place-name"].value = "";
  newCardPopup.inputs.link.value = "";
  newCardPopup.open();
});

/////

const imagePopup = attachPopupListeners(".popup_type_image");
const popupImage = imagePopup.element.querySelector(".popup__image");
const popupCaption = imagePopup.element.querySelector(".popup__caption");
function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  imagePopup.open();
}

//////

const cardsContainer = document.querySelector(".places__list");
getCurrentUser()
  .then(setCurrentUser)
  .then(getCardsList)
  .then((cards) => {
    for (const cardData of cards) {
      cardsContainer.append(renderCard(cardData));
    }
  });
