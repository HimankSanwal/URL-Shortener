let allUrls = [];

// Load all URLs
async function loadUrls() {

    try {

        const response = await fetch("/api/urls");

        const result = await response.json();

        if (!result.success) {

            alert("Failed to load URLs.");

            return;

        }

        allUrls = result.data;

        displayUrls(allUrls);

    }

    catch (error) {

        console.error(error);

        alert("Could not load URLs.");

    }

}

// Display table
function displayUrls(urls) {

    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    urls.forEach((url) => {

        const shortUrl = `${window.location.origin}/${url.shortCode}`;

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${url.originalUrl}</td>

            <td>

                <a href="${shortUrl}" target="_blank">

                    ${shortUrl}

                </a>

            </td>

            <td>${url.clicks}</td>

            <td>${new Date(url.createdAt).toLocaleString()}</td>

            <td>

                <button onclick="copyUrl('${shortUrl}')">

                    📋 Copy

                </button>

                <button onclick="window.open('${url.originalUrl}','_blank')">

                    🌐 Visit

                </button>

                <button onclick="showQRCode('${url.shortCode}')">

                    📱 QR

                </button>

                <button onclick="deleteUrl('${url._id}')">

                    🗑 Delete

                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });

}

// Search
document.getElementById("searchInput").addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = allUrls.filter((url) => {

        return (

            url.originalUrl.toLowerCase().includes(value) ||

            url.shortCode.toLowerCase().includes(value)

        );

    });

    displayUrls(filtered);

});

// Copy URL
async function copyUrl(shortUrl) {

    try {

        await navigator.clipboard.writeText(shortUrl);

        alert("✅ Short URL copied!");

    }

    catch (error) {

        console.error(error);

        alert("Failed to copy URL.");

    }

}

// Delete URL
async function deleteUrl(id) {

    const confirmDelete = confirm("Delete this URL?");

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await fetch(`/api/url/${id}`, {

            method: "DELETE"

        });

        const result = await response.json();

        if (result.success) {

            await loadUrls();

        }

        else {

            alert(result.message);

        }

    }

    catch (error) {

        console.error(error);

        alert("Failed to delete URL.");

    }

}

// Show QR Code
async function showQRCode(shortCode) {

    try {

        const response = await fetch(`/api/qrcode/${shortCode}`);

        const result = await response.json();

        if (!result.success) {

            alert(result.message);

            return;

        }

        document.getElementById("qrImage").src = result.qr;

        document.getElementById("qrModal").style.display = "block";

    }

    catch (error) {

        console.error(error);

        alert("Failed to generate QR Code.");

    }

}

// Close QR Modal
document.getElementById("closeModal").addEventListener("click", () => {

    document.getElementById("qrModal").style.display = "none";

});

// Close modal by clicking outside
window.addEventListener("click", (event) => {

    const modal = document.getElementById("qrModal");

    if (event.target === modal) {

        modal.style.display = "none";

    }

});

// Initial Load
loadUrls();