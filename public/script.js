const shortenBtn = document.getElementById("shortenBtn");

shortenBtn.addEventListener("click", async () => {

    const originalUrl = document.getElementById("urlInput").value.trim();
    const customCode = document.getElementById("customCode").value.trim();

    if (!originalUrl) {
        alert("Please enter a URL.");
        return;
    }

    try {

        // Create Short URL
        const response = await fetch("/api/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                originalUrl,
                customCode
            })

        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message || "Something went wrong.");

            return;

        }

        // Get latest analytics
        const statsResponse = await fetch(
            `/api/stats/${data.data.shortCode}`
        );

        const stats = await statsResponse.json();

        const shortUrl = `${window.location.origin}/${data.data.shortCode}`;

        document.getElementById("result").innerHTML = `

            <hr>

            <h2>Original URL</h2>

            <p>${stats.data.originalUrl}</p>

            <br>

            <h2>Short URL</h2>

            <a href="${shortUrl}" target="_blank">

                ${shortUrl}

            </a>

            <br><br>

            <button id="copyBtn">

                📋 Copy URL

            </button>

            <br><br>

            <h2>Analytics</h2>

            <p>

                <strong>Clicks:</strong>

                <span id="clickCount">

                    ${stats.data.clicks}

                </span>

            </p>

            <p>

                <strong>Created:</strong>

                ${new Date(stats.data.createdAt).toLocaleString()}

            </p>

            <br>

            <button id="refreshBtn">

                🔄 Refresh Analytics

            </button>

        `;

        // Copy Button
        document
            .getElementById("copyBtn")
            .addEventListener("click", () => {

                navigator.clipboard.writeText(shortUrl);

                alert("Short URL copied!");

            });

        // Refresh Analytics
        document
            .getElementById("refreshBtn")
            .addEventListener("click", async () => {

                const analyticsResponse = await fetch(
                    `/api/stats/${data.data.shortCode}`
                );

                const analytics = await analyticsResponse.json();

                document.getElementById("clickCount").innerText =
                    analytics.data.clicks;

            });

    }

    catch (error) {

        console.error(error);

        alert("Server Error");

    }

});