function createFetch(path, method, body) {
  return async (arg) => {
    const res = await fetch(
      `https://nomoreparties.co/v1/frontend-st-cohort-201${typeof path === "function" ? path(arg) : path}`,
      {
        headers: {
          authorization: "3165204e-3089-44ad-9611-7d0f2c504fde",
          "Content-Type": "application/json",
        },
        method,
        ...(method !== "GET" &&
          typeof body === "function" && { body: JSON.stringify(body(arg)) }),
      },
    );
    if (res.ok) {
      return await res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  };
}

export const getCurrentUser = createFetch("/users/me", "GET");
export const updateCurrentUser = createFetch("/users/me", "PATCH", (d) => d);
export const updateCurrentUserAvatar = createFetch(
  "/users/me/avatar",
  "PATCH",
  (d) => d,
);
export const getCardsList = createFetch("/cards", "GET");
export const createCard = createFetch("/cards", "POST", (d) => d);
export const deleteCard = createFetch(({ id }) => `/cards/${id}`, "DELETE");
export const addLike = createFetch(
  ({ cardId }) => `/cards/likes/${cardId}`,
  "PUT",
);
export const rmLike = createFetch(
  ({ cardId }) => `/cards/likes/${cardId}`,
  "DELETE",
);
