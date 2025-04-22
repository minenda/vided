const videoInput = document.getElementById('videoInput');
const videoPlayer = document.getElementById('videoPlayer');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const cutBtn = document.getElementById('cutBtn');

let selectedFile = null;

// Load video ke player saat diupload
videoInput.addEventListener('change', function () {
  selectedFile = this.files[0];
  if (selectedFile) {
    const url = URL.createObjectURL(selectedFile);
    videoPlayer.src = url;
  }
});

cutBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    alert("Silakan pilih video terlebih dahulu!");
    return;
  }

  const start = parseFloat(startTimeInput.value);
  const end = parseFloat(endTimeInput.value);

  if (isNaN(start) || isNaN(end) || start >= end) {
    alert("Waktu mulai dan akhir tidak valid.");
    return;
  }

  await cutVideo(selectedFile, start, end);
});

async function cutVideo(file, start, end) {
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });

  try {
    // Tampilkan loading
    cutBtn.disabled = true;
    cutBtn.textContent = "Memotong...";

    await ffmpeg.load();

    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

    await ffmpeg.run(
      '-ss', `${start}`,
      '-to', `${end}`,
      '-i', 'input.mp4',
      '-c', 'copy',
      'output.mp4'
    );

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const url = URL.createObjectURL(videoBlob);

    // Tampilkan tombol download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'potongan-video.mp4';
    a.textContent = "⬇️ Download Video Hasil Potong";
    a.style.display = 'block';
    a.style.marginTop = '10px';
    document.body.appendChild(a);

  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
    console.error(err);
  } finally {
    cutBtn.disabled = false;
    cutBtn.textContent = "Potong Video";
  }
}
