export default function ProfilePhotoUploader({ onUpload }) {
  function handleFileChange(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    fetch('http://localhost:5000/api/users/upload-photo', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => onUpload(data.url));
  }

  return (
    <input type="file" onChange={handleFileChange} accept="image/*" />
  );
}