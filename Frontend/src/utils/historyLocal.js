export function getLocalHistory() {
  const raw = localStorage.getItem('viewHistory');
  return raw ? JSON.parse(raw) : [];
}

export function addLocalView(media) {
  const list = getLocalHistory();
  const filtered = list.filter(i => i.mediaId !== media.mediaId);
  const entry = { ...media, lastViewed: Date.now() };
  const updated = [entry, ...filtered];
  localStorage.setItem('viewHistory', JSON.stringify(updated));
  return updated;
}

export function removeLocalView(mediaId) {
  const list = getLocalHistory().filter(i => i.mediaId !== mediaId);
  localStorage.setItem('viewHistory', JSON.stringify(list));
  return list;
}

export function clearLocalHistory() {
  localStorage.removeItem('viewHistory');
}