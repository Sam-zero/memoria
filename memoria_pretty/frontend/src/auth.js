const KEY = "token";

export function setToken(token) {
    localStorage.setItem(KEY, token);
}

export function getToken() {
    return localStorage.getItem(KEY);
}

export function isAuthed() {
    return Boolean(getToken());
}

export function logout() {
    localStorage.removeItem(KEY);
}
