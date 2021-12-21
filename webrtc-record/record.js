// async function async1() {
//     await async2()
//     console.log('async1 end')//3
// }
// async function async2() {
//     console.log('async2 end')//1
// }
// async1()
// setTimeout(function(){
//     console.log('setTimeout')//6
// },0)
// new Promise(resolve=>{
//     console.log('Promise')//2
//     resolve()
// })
// .then(function(){
//     console.log('promise1')//4
// })
// .then(function(){
//     console.log('promise2')//5
// })

class Record {
    constructor() {
        this.buffer = [];
        this.mediaRecord;
        this.stream;
        this.handleDataAvailable = this.handleDataAvailable.bind(this);
    }

    // 开启摄像头
    async start() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia is not supported!");
            return;
        } else {
            let constraints = {
                video: {
                    width: 640,
                    height: 480,
                    frameRate: 15,
                },
                audio: false,
            };

            try {
                const stream = await navigator.mediaDevices.getUserMedia(
                    constraints
                );
                this.stream = stream;
                return stream;
            } catch (e) {
                console.log("getUserMedia error:", err);
            }
        }
    }

    handleDataAvailable(e) {
        if (e && e.data && e.data.size > 0) {
            this.buffer.push(e.data);
        }
    }

    // 开始录制
    startRecord() {
        let options = {
            mimeType: "video/webm;codecs=vp8",
        };

        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not supported!`);
            return;
        }

        try {
            this.mediaRecorder = new MediaRecorder(this.stream, options);
        } catch (e) {
            console.error("Failed to create MediaRecorder:", e);
            return;
        }

        this.mediaRecorder.ondataavailable = this.handleDataAvailable;

        this.mediaRecorder.start(10);
    }

    // 开始录制回播, 需要传入播放视频的dom节点
    startRecplay(dom) {
        let blob = new Blob(this.buffer, { type: "video/webm" });
        dom.src = window.URL.createObjectURL(blob);
        dom.srcObject = null;
        dom.controls = true;
        dom.play();
    }

    // 录制回播下载
    download() {
        let blob = new Blob(this.buffer, { type: "video/webm" });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");

        a.href = url;
        a.style.display = "none";
        a.download = "aaa.webm";
        a.click();
        a.remove();
    }

    // 停止录制
    stopRecord() {
        this.mediaRecorder.stop();
    }
}

export default Record;
