const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const preview = document.getElementById('preview');

let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener('click', async () => {
    try {
        // Solicita a captura da tela e do áudio
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        // Exibe a pré-visualização
        preview.srcObject = stream;

        // Configura o MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            // Permite o download do vídeo
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gravacao.webm';
            a.click();
        };

        mediaRecorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (error) {
        console.error('Erro ao capturar tela:', error);
    }
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    preview.srcObject.getTracks().forEach(track => track.stop());
});
