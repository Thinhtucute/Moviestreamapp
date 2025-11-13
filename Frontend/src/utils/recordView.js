import { addLocalView } from './historyLocal';
import { addViewBackend } from '../services/historyServices';

export default function recordView(media) {
  if (!media) {
    console.debug('recordView: no media provided');
    return;
  }

  const mediaId = Number(media.id ?? media.mediaId ?? media.movieId);
  if (!mediaId || Number.isNaN(mediaId)) {
    console.debug('recordView: invalid mediaId', media);
    return;
  }

  const item = {
    mediaId,
    title: media.title ?? media.name ?? '',
    posterURL: media.posterUrl ?? media.posterURL ?? media.poster ?? '',
    mediaType: media.type ?? media.mediaType ?? '',
    lastViewed: new Date().toISOString(),
  };

  try {
    addLocalView(item);
  } catch (e) {
    console.debug('recordView: addLocalView failed', e);
  }

  console.debug('recordView: calling backend for mediaId', mediaId);
  addViewBackend(mediaId)
    .then(res => console.debug('recordView: addViewBackend success', res && res.status ? res.status : res))
    .catch(err => console.error('recordView: addViewBackend failed', err));
}