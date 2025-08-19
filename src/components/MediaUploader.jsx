import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function MediaUploader({ markerId, onUploaded }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    const path = `markers/${markerId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on('state_changed', (snapshot) => {
      const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setProgress(pct);
    });

    try {
      await task;
      const url = await getDownloadURL(storageRef);
      onUploaded?.({ url, type: file.type.startsWith('video') ? 'video' : 'image' });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Upload failed. ' + (err?.message || ''));
    } finally {
      setIsUploading(false);
      setProgress(0);
      e.target.value = '';
    }
  };

  return (
    <div>
      <input type="file" accept="image/*,video/*" disabled={isUploading} onChange={handleFileChange} />
      {isUploading && <div>Uploading... {progress}%</div>}
    </div>
  );
}


