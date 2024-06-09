let uploadButton = document.getElementById("upload-button");
let chosenImage = document.getElementById("chosen-image");
let chosenImageOut = document.getElementById("chosen-image-out");
let fileName = document.getElementById("file-name");
let uploadForm = document.getElementById("upload-form");
let btnInParking = document.getElementById("btnInParking");
let btnInParkingOut = document.getElementById("btnInParking-out");
let licenePlate = document.getElementById('licenePlate');
let licenePlateOut = document.getElementById('licenePlate-out');
let uploadButtonOut = document.getElementById("upload-button-out");

// let host = "http://localhost:8010"
let host = "https://park.workon.space"

uploadButton.onchange = () => {
    // console.log('--------------------------')
    let reader = new FileReader();
    reader.readAsDataURL(uploadButton.files[0]);
    reader.onload = () => {
        chosenImage.setAttribute("src", reader.result);
        // uploadForm.submit();
        const formData = new FormData();
        formData.append('file', uploadButton.files[0]);
        console.log(uploadButton.files[0]);
        fetch('/uploads', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    document.getElementById('licenePlate').value = data.result;
                } else {
                    document.getElementById('licenePlate').value = '';
                }
            })
            .catch(error => {
                document.getElementById('licenePlate').value = '';
            });
    }
}

uploadButtonOut.onchange = () => {
    console.log('--------------------------')
    let reader = new FileReader();
    reader.readAsDataURL(uploadButtonOut.files[0]);
    reader.onload = () => {
        chosenImageOut.setAttribute("src", reader.result);
        // uploadForm.submit();
        const formData = new FormData();
        formData.append('file', uploadButtonOut.files[0]);
        // console.log(uploadButtonOut.files[0]);
        fetch('/uploads', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    document.getElementById('licenePlate-out').value = data.result;
                } else {
                    document.getElementById('licenePlate-out').value = '';
                }
            })
            .catch(error => {
                document.getElementById('licenePlate-out').value = '';
            });
    }
}

async function handleButtonInParking() {
    const url = host + '/api/parkingTurn/createPakingTurnWithoutZoneAndPosition';

    try {
        console.log(typeof(uploadButton.files[0]))
        
        if (licenePlate.value == '') {

        }
        else {
            // Gửi yêu cầu fetch
            const formData = new FormData();
            formData.append('image', uploadButton.files[0]);
            formData.append('licenePlate', licenePlate.value);
            const response = await fetch(url, {
                method: 'POST', // Hoặc 'POST', 'PUT', v.v. tùy thuộc vào yêu cầu của bạn
                body: formData
            });

            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                const data = await response.json();
                Swal.fire(data.message);
                throw new Error('Network response was not ok ' + response.statusText);
            }

            // Chuyển đổi dữ liệu phản hồi thành JSON
            const data = await response.json();
            console.log(data); // Xử lý dữ liệu JSON tại đây (ví dụ: hiển thị trên giao diện)
            Swal.fire({
                title: "Xe vào bãi!",
                html: "Xe " + licenePlate.value + " vào bãi<br>Vị trí đỗ:" + data.position,
                icon: "success"
            });
        }

    } catch (error) {
        console.error('Fetch error: ', error);
    }
}

async function handleButtonInParkingOut() {
    const url = 'http://127.0.0.1:5000/service' + '/licenseS';
    const urlImage = 'http://127.0.0.1:5000/service' + '/imagecap';
    chosenImage.src = urlImage;
    try {
        const response = await fetch(url, {
            method: 'GET', // Hoặc 'POST', 'PUT', v.v. tùy thuộc vào yêu cầu của bạn
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const response1  = await fetch(urlImage, {
            method: 'GET', // Hoặc 'POST', 'PUT', v.v. tùy thuộc vào yêu cầu của bạn
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response1.body)
        if (!response.ok) {
            const data = await response.json();
            Swal.fire(data.message);
            throw new Error('Network response was not ok ' + response.statusText);
        }

        // Chuyển đổi dữ liệu phản hồi thành JSON
        const data = await response.json();
        console.log(data.result); // Xử lý dữ liệu JSON tại đây (ví dụ: hiển thị trên giao diện)


    } catch (error) {
        console.error('Fetch error: ', error);
    }
}

// Đợi DOM được tải đầy đủ rồi thêm sự kiện lắng nghe vào nút
btnInParking.addEventListener('click', handleButtonInParking);


btnInParkingOut.addEventListener('click', handleButtonInParkingOut);